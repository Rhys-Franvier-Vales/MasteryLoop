// Exercises the HTTP layer for everything that does not need a database connection.
import "./setup.js";
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

let server, base;

before(async () => {
  const { default: app } = await import("../src/app.js");
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const post = (path, body, headers = {}) =>
  fetch(base + path, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });

test("health check", async () => {
  const res = await fetch(base + "/api/health");
  assert.equal(res.status, 200);
  assert.equal((await res.json()).status, "ok");
});

test("unknown route returns a JSON 404", async () => {
  const res = await fetch(base + "/api/nope");
  assert.equal(res.status, 404);
  assert.ok((await res.json()).message);
});

test("register rejects bad input before touching the database", async () => {
  const res = await post("/api/auth/register", { name: "A", email: "bad", password: "x" });
  assert.equal(res.status, 400);
});

test("login rejects missing fields", async () => {
  assert.equal((await post("/api/auth/login", {})).status, 400);
});

test("protected routes need a token", async () => {
  for (const path of ["/api/skills", "/api/skills/due", "/api/users/me/stats", "/api/auth/me"]) {
    const res = await fetch(base + path);
    assert.equal(res.status, 401, path);
  }
  assert.equal((await post("/api/attempts", {})).status, 401);
});

test("a garbage or wrongly signed token is rejected", async () => {
  const forged = jwt.sign({ id: "507f1f77bcf86cd799439011" }, "not-the-secret");
  for (const token of ["garbage", forged]) {
    const res = await fetch(base + "/api/skills", { headers: { Authorization: `Bearer ${token}` } });
    assert.equal(res.status, 401);
  }
});

test("malformed JSON gives a 400, not a crash", async () => {
  const res = await fetch(base + "/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{oops" });
  assert.equal(res.status, 400);
});
