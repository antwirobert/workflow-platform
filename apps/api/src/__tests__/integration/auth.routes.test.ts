import request from "supertest";
import app from "../../app";

describe("POST /api/auth/register", () => {
  it("should register a new user and return 201", async () => {
    const email = `robert-${Date.now()}@test.com`;
    const res = await request(app).post("/api/auth/register").send({
      name: "Robert",
      email,
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    expect(res.body.user.email).toBe(email);
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("should return 409 if email already exists", async () => {
    const email = `robert-duplicate-${Date.now()}@test.com`;
    await request(app).post("/api/auth/register").send({
      name: "Robert",
      email,
      password: "password123",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Robert",
      email,
      password: "password123",
    });

    expect(res.status).toBe(409);
  });

  it("should return 400 if required fields are missing", async () => {
    const email = `robert-missing-${Date.now()}@test.com`;
    const res = await request(app).post("/api/auth/register").send({ email });

    expect(res.status).toBe(400);
  });
});

describe("POST api/auth/login", () => {
  let loginEmail: string;

  beforeEach(async () => {
    loginEmail = `robert-login-${Date.now()}-${Math.random()}@test.com`;
    await request(app).post("/api/auth/register").send({
      name: "Robert",
      email: loginEmail,
      password: "password123",
    });
  });

  it("should login and return tokens", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: loginEmail, password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });

  it("should return 401 with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: loginEmail, password: "wrongpassword" });

    expect(res.status).toBe(401);
  });
});
