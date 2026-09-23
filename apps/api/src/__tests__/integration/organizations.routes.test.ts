jest.mock("../../redis/cache", () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
  deleteCache: jest.fn(),
  deleteCacheByPattern: jest.fn(),
}));

import request from "supertest";
import app from "../../app";

const authHeaders = async (email: string, name = "Org User") => {
  const registerRes = await request(app).post("/api/auth/register").send({
    name,
    email,
    password: "password123",
  });

  return {
    token: registerRes.body.accessToken,
    user: registerRes.body.user,
  };
};

describe("Organizations routes", () => {
  it("creates an organization for an authenticated user", async () => {
    const { token } = await authHeaders("org.create@example.com");

    const res = await request(app)
      .post("/api/organizations")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Acme Labs", slug: "acme-labs" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      name: "Acme Labs",
      slug: "acme-labs",
      role: "OWNER",
    });
  });

  it("lists and fetches organization data for the current user", async () => {
    const { token } = await authHeaders("org.list@example.com");

    await request(app)
      .post("/api/organizations")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Northwind", slug: "northwind" });

    const listRes = await request(app)
      .get("/api/organizations")
      .set("Authorization", `Bearer ${token}`)
      .query({ page: 1, limit: 12 });

    const detailsRes = await request(app)
      .get("/api/organizations/northwind")
      .set("Authorization", `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Northwind",
          slug: "northwind",
        }),
      ]),
    );

    expect(detailsRes.status).toBe(200);
    expect(detailsRes.body).toMatchObject({
      name: "Northwind",
      slug: "northwind",
      role: "OWNER",
    });
  });

  it("updates organization fields and rejects duplicate slugs", async () => {
    const { token } = await authHeaders("org.patch@example.com");

    await request(app)
      .post("/api/organizations")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Bluebird", slug: "bluebird" });

    const updateRes = await request(app)
      .patch("/api/organizations/bluebird")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Bluebird Studio", slug: "bluebird-studio" });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body).toMatchObject({
      name: "Bluebird Studio",
      slug: "bluebird-studio",
    });

    const duplicateRes = await request(app)
      .post("/api/organizations")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Another Org", slug: "bluebird-studio" });

    expect(duplicateRes.status).toBe(409);
  });

  it("deletes an organization when the user is the owner", async () => {
    const { token } = await authHeaders("org.delete@example.com");

    await request(app)
      .post("/api/organizations")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Atlas", slug: "atlas" });

    const res = await request(app)
      .delete("/api/organizations/atlas")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);

    const followUp = await request(app)
      .get("/api/organizations/atlas")
      .set("Authorization", `Bearer ${token}`);

    expect(followUp.status).toBe(404);
  });
});
