import test from "node:test";
import assert from "node:assert/strict";
import { emptyTask, formatStatus, isOverdue, validateTask } from "./taskUtils.js";

test("formats task status", () => {
  assert.equal(formatStatus("IN_PROGRESS"), "In Progress");
});

test("detects overdue incomplete task", () => {
  assert.equal(isOverdue({
    deadline: "2025-01-01T10:00:00",
    status: "PENDING"
  }, new Date("2025-01-02T10:00:00")), true);
});

test("does not mark completed task overdue", () => {
  assert.equal(isOverdue({
    deadline: "2025-01-01T10:00:00",
    status: "COMPLETED"
  }, new Date("2025-01-02T10:00:00")), false);
});

test("validates required fields", () => {
  const errors = validateTask({ ...emptyTask, title: "" });
  assert.equal(errors.title, "Title is required.");
});
