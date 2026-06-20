import { test } from "node:test";
import assert from "node:assert/strict";
import { loginLimiter, registerLimiter, uploadLimiter, forgotPasswordLimiter } from "../middleware/rateLimit.js";
import { isDbConnected } from "../utilies/db.js";

test("rate limiters are configured", () => {
  assert.ok(loginLimiter);
  assert.ok(registerLimiter);
  assert.ok(uploadLimiter);
  assert.ok(forgotPasswordLimiter);
});

test("isDbConnected returns false before connection", () => {
  assert.equal(isDbConnected(), false);
});
