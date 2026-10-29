// server/src/routes/__tests__/posts.integration.test.js

import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../db/client.js";
import { resetDatabase } from "../../test-utils/fixtures.js";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

test(
  "full flow: register, publish, and browse (US-01, US-03, US-04 validation)",
  async () => {
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({
        email: "alice@example.com",
        displayName: "Alice",
        password: "correcthorse"
      });

    expect(registerRes.status).toBe(201);

    const { user, accessToken } = registerRes.body;

    const publishRes = await request(app)
      .post("/api/posts")
      .set(
        "Authorization",
        `Bearer ${accessToken}`
      )
      .send({
        authorId: user.id,
        title: "Hello, Inkwell",
        body: "My first real post."
      });

    expect(publishRes.status).toBe(201);

    const feedRes = await request(app)
      .get("/api/posts?page=1");

    expect(feedRes.status).toBe(200);
    expect(feedRes.body.posts).toHaveLength(1);
    expect(feedRes.body.posts[0].title)
      .toBe("Hello, Inkwell");
  }
);

test(
  "registering with a duplicate email fails end to end (US-01 extension 3a, validated)",
  async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        email: "alice@example.com",
        displayName: "Alice",
        password: "correcthorse"
      });

    const secondAttempt = await request(app)
      .post("/api/auth/register")
      .send({
        email: "alice@example.com",
        displayName: "Alice Two",
        password: "correcthorse"
      });

    expect(secondAttempt.status).toBe(400);

    expect(
      secondAttempt.body.error.code
    ).toBe("EMAIL_ALREADY_REGISTERED");
  }
);

test(
  "registration and login work together",
  async () => {
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({
        email: "login-test@example.com",
        displayName: "Login Test",
        password: "correcthorse"
      });

    expect(registerRes.status).toBe(201);

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login-test@example.com",
        password: "correcthorse"
      });

    expect(loginRes.status).toBe(200);

    expect(
      loginRes.body.accessToken
    ).toBeDefined();

    expect(
      loginRes.body.refreshToken
    ).toBeDefined();

    expect(
      loginRes.body.user.email
    ).toBe(
      "login-test@example.com"
    );
  }
);

test.each([
  "/api/posts?pageSize=51",
  "/api/posts?pageSize=51&search=hello"
])(
  "rejects an oversized pageSize request: %s",
  async (url) => {
    const response = await request(app)
      .get(url);

    expect(response.status).toBe(400);

    expect(
      response.body.error.code
    ).toBe("INVALID_PAGINATION");
  }
);

test(
  "accepts the maximum pageSize of 50",
  async () => {
    const response = await request(app)
      .get("/api/posts?pageSize=50");

    expect(response.status).toBe(200);

    expect(
      response.body.posts
    ).toEqual([]);
  }
);