import { test } from "node:test";
import assert from "node:assert/strict";
import { hashToken, generateResetToken } from "../utilies/authTokens.js";

test("hashToken is deterministic", () => {
  const token = "test-reset-token-value";
  assert.equal(hashToken(token), hashToken(token));
});

test("hashToken produces 64-char hex digest", () => {
  const digest = hashToken("abc");
  assert.equal(digest.length, 64);
  assert.match(digest, /^[a-f0-9]+$/);
});

test("generateResetToken returns unique 64-char hex strings", () => {
  const a = generateResetToken();
  const b = generateResetToken();
  assert.equal(a.length, 64);
  assert.equal(b.length, 64);
  assert.notEqual(a, b);
});

test("reset token hashes match stored lookup pattern", () => {
  const raw = generateResetToken();
  const stored = hashToken(raw);
  assert.equal(hashToken(raw), stored);
});
