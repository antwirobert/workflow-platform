import request from "supertest";
import app from "../../app";

describe("POST /api/auth/register", () => {
  it("should register a new user and return 201", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Robert",
      email: "robert@test.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    expect(res.body.user.email).toBe("robert@test.com");
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("should return 409 if email already exists", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Robert",
      email: "robert@test.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Robert",
      email: "robert@test.com",
      password: "password123",
    });

    expect(res.status).toBe(409);
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "robert@test.com" });

    expect(res.status).toBe(400);
  });
});

describe("POST api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send({
      name: "Robert",
      email: "robert@test.com",
      password: "password123",
    });
  });

  it("should login and return tokens", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "robert@test.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });

  it("should return 401 with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "robert@test.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
  });
});
