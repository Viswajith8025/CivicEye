import { test } from "node:test";
import assert from "node:assert/strict";
import { canSubmitAppeal } from "../services/appealService.js";

function canViewCommunityReport({ isPublic, isOwner, isAdmin }) {
  if (isPublic !== false) return true;
  return isOwner || isAdmin;
}

test("private community reports hidden from non-owners", () => {
  assert.equal(canViewCommunityReport({ isPublic: false, isOwner: false, isAdmin: false }), false);
});

test("private community reports visible to owner", () => {
  assert.equal(canViewCommunityReport({ isPublic: false, isOwner: true, isAdmin: false }), true);
});

test("private community reports visible to admin", () => {
  assert.equal(canViewCommunityReport({ isPublic: false, isOwner: false, isAdmin: true }), true);
});

test("public community reports visible to all", () => {
  assert.equal(canViewCommunityReport({ isPublic: true, isOwner: false, isAdmin: false }), true);
});

test("canSubmitAppeal blocks resubmission after denial", () => {
  const result = canSubmitAppeal({ status: "Rejected", appealStatus: "denied" });
  assert.equal(result.ok, false);
});
