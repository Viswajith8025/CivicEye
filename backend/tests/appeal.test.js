import { test } from "node:test";
import assert from "node:assert/strict";
import { canSubmitAppeal } from "../services/appealService.js";

test("canSubmitAppeal allows first appeal on rejected report", () => {
  const result = canSubmitAppeal({ status: "Rejected", appealStatus: "none" });
  assert.equal(result.ok, true);
});

test("canSubmitAppeal allows appeal after prior acceptance and re-rejection", () => {
  const result = canSubmitAppeal({ status: "Rejected", appealStatus: "accepted" });
  assert.equal(result.ok, true);
});

test("canSubmitAppeal blocks non-rejected reports", () => {
  const result = canSubmitAppeal({ status: "Pending", appealStatus: "none" });
  assert.equal(result.ok, false);
  assert.match(result.message, /rejected/i);
});

test("canSubmitAppeal blocks duplicate pending appeals", () => {
  const result = canSubmitAppeal({ status: "Rejected", appealStatus: "pending" });
  assert.equal(result.ok, false);
  assert.match(result.message, /pending/i);
});

test("canSubmitAppeal blocks resubmission after denial", () => {
  const result = canSubmitAppeal({ status: "Rejected", appealStatus: "denied" });
  assert.equal(result.ok, false);
  assert.match(result.message, /denied/i);
});
