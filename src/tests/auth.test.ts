import { describe, it, expect, beforeAll } from "vitest";
import {
  checkPasswordHash,
  hashPassword,
  makeJWT,
  validateJWT,
  payload,
} from "../auth.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result1 = await checkPasswordHash(hash1, password1);
    const result2 = await checkPasswordHash(hash2, password2);
    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });
});

describe("JWT creation", () => {
  let jwt1: string;
  let jwt2: string;
  let jwt3: string;

  beforeAll(() => {
    jwt1 = makeJWT("1", 5000, "12345");
    jwt2 = makeJWT("2", 5000, "12345");
    jwt3 = makeJWT("", 5000, "12345");
    console.log(jwt3);
    console.log("\n\n");
    console.log(jwt2);
  });

  it("should return the correct userID for the correct secret", () => {
    const result1 = validateJWT(jwt1, "12345");
    const result2 = validateJWT(jwt2, "12345");
    expect(result1).toBe("1");
    expect(result2).toBe("2");
  });

  it("should throw an error for wrong secret", () => {
    expect(() => validateJWT(jwt1, "23456")).toThrow(
      "Error with JWT expired or invalid",
    );
    expect(() => validateJWT(jwt2, "56789")).toThrow(
      "Error with JWT expired or invalid",
    );
  });

  it("should throw an error for no userID", () => {
    expect(() => validateJWT(jwt3, "12345")).toThrow("No subject in token");
  });
});
