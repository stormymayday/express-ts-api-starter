import { describe, test, expect } from "vitest";
import { connect } from "./helpers/dbHelpers.js";

describe("Test Setup Verification", () => {
  test("should connect to test database", async () => {
    const response = await connect();
    expect(response.rows[0].current_database).toBe("my-test-db");
  });
});
