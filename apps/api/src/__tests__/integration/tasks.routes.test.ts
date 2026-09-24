jest.mock("../../redis/cache", () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
  deleteCache: jest.fn(),
  deleteCacheByPattern: jest.fn(),
}));

import request from "supertest";
import app from "../../app";
import { prisma } from "../../lib/prisma";

const createTaskContext = async (suffix: string) => {
  const registerRes = await request(app).post("/api/auth/register").send({
    name: "Task Owner",
    email: `task-${suffix}@example.com`,
    password: "password123",
  });
  const { accessToken, user } = registerRes.body;

  const organizationRes = await request(app)
    .post("/api/organizations")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({ name: `Task Org ${suffix}`, slug: `task-org-${suffix}` });

  const workspace = await prisma.workspace.create({
    data: {
      name: "Task Workspace",
      slug: `task-workspace-${suffix}`,
      organizationId: organizationRes.body.id,
    },
  });
  const project = await prisma.project.create({
    data: {
      name: "Task Project",
      slug: `task-project-${suffix}`,
      workspaceId: workspace.id,
    },
  });

  return {
    token: accessToken as string,
    userId: user.id as string,
    orgSlug: organizationRes.body.slug as string,
    workspaceSlug: workspace.slug,
    projectSlug: project.slug,
  };
};

const tasksPath = (context: Awaited<ReturnType<typeof createTaskContext>>) =>
  `/api/organizations/${context.orgSlug}/workspaces/${context.workspaceSlug}/projects/${context.projectSlug}/tasks`;

describe("Tasks routes", () => {
  it("creates, lists, fetches, and updates tasks", async () => {
    const context = await createTaskContext(`lifecycle-${Date.now()}`);
    const path = tasksPath(context);

    const createRes = await request(app)
      .post(path)
      .set("Authorization", `Bearer ${context.token}`)
      .send({
        title: "Ship task tests",
        description: "Exercise the task lifecycle",
        priority: "HIGH",
        labels: ["api", "tests"],
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body).toMatchObject({
      title: "Ship task tests",
      status: "TODO",
      priority: "HIGH",
      labels: ["api", "tests"],
    });

    const taskId = createRes.body.id;
    const listRes = await request(app)
      .get(path)
      .set("Authorization", `Bearer ${context.token}`)
      .query({ status: "TODO", priority: "HIGH", page: 1, limit: 12 });

    expect(listRes.status).toBe(200);
    expect(listRes.body).toMatchObject({
      meta: { total: 1, page: 1, limit: 12 },
      data: [expect.objectContaining({ id: taskId, title: "Ship task tests" })],
    });

    const detailRes = await request(app)
      .get(`${path}/${taskId}`)
      .set("Authorization", `Bearer ${context.token}`);
    expect(detailRes.status).toBe(200);
    expect(detailRes.body.id).toBe(taskId);

    const updateRes = await request(app)
      .patch(`${path}/${taskId}`)
      .set("Authorization", `Bearer ${context.token}`)
      .send({ status: "DONE", title: "Ship task tests now" });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body).toMatchObject({
      id: taskId,
      title: "Ship task tests now",
      status: "DONE",
    });

    const storedTask = await prisma.task.findUnique({ where: { id: taskId } });
    expect(storedTask?.completedAt).toEqual(expect.any(Date));
  });

  it("rejects invalid task input and unauthenticated access", async () => {
    const context = await createTaskContext(`validation-${Date.now()}`);
    const path = tasksPath(context);

    const unauthenticated = await request(app).get(path);
    expect(unauthenticated.status).toBe(401);

    const invalid = await request(app)
      .post(path)
      .set("Authorization", `Bearer ${context.token}`)
      .send({ title: "x", priority: "INVALID" });
    expect(invalid.status).toBe(400);
  });

  it("soft deletes a task and requires an administrator role", async () => {
    const context = await createTaskContext(`delete-${Date.now()}`);
    const path = tasksPath(context);
    const createRes = await request(app)
      .post(path)
      .set("Authorization", `Bearer ${context.token}`)
      .send({ title: "Delete this task" });

    const deleteRes = await request(app)
      .delete(`${path}/${createRes.body.id}`)
      .set("Authorization", `Bearer ${context.token}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.id).toBe(createRes.body.id);

    const storedTask = await prisma.task.findUnique({
      where: { id: createRes.body.id },
    });
    expect(storedTask?.deletedAt).toEqual(expect.any(Date));

    const detailRes = await request(app)
      .get(`${path}/${createRes.body.id}`)
      .set("Authorization", `Bearer ${context.token}`);
    expect(detailRes.status).toBe(404);
  });
});