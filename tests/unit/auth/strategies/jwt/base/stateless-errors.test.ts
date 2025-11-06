// tests/auth/jwt/stateless-strategy.test.ts
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  JWTExpiredError,
  JWTInvalidError,
  JWTSignError,
  JWTUnknownError,
} from "@/src/auth/strategies/jwt/base/errors";
import { StatelessJWTStrategy } from "@/src/auth/strategies/jwt/base/stateless-jwt-strategy";

import { keyPairs, pickRandomAlgorithm } from "../helpers";

// Fake timers setup for expiry tests
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("StatelessJWTStrategy - Error Handling", () => {
  it("should throw JWTExpiredError for expired token", async () => {
    const algo = pickRandomAlgorithm();
    const { privateKey } = keyPairs[algo];

    const strategy = new StatelessJWTStrategy({
      secret: privateKey,
      algorithm: algo,
      expiresIn: "1s", // very short expiry
    });

    const payload = { sub: "user1" };
    const token = strategy.generateToken(payload);

    // Advance time beyond expiry
    vi.advanceTimersByTime(2000);

    await expect(strategy.validateToken(token)).rejects.toBeInstanceOf(
      JWTExpiredError,
    );
  });

  it("should throw JWTInvalidError for malformed token", async () => {
    const algo = pickRandomAlgorithm();
    const { privateKey } = keyPairs[algo];

    const strategy = new StatelessJWTStrategy({
      secret: privateKey,
      algorithm: algo,
    });

    const malformedToken = "this.is.not.a.valid.token";

    await expect(strategy.validateToken(malformedToken)).rejects.toBeInstanceOf(
      JWTInvalidError,
    );
  });

  it("should throw JWTUnknownError for unexpected errors", async () => {
    const algo = pickRandomAlgorithm();
    const { privateKey } = keyPairs[algo];

    const strategy = new StatelessJWTStrategy({
      secret: privateKey,
      algorithm: algo,
    });

    // Mock jwt.verify to throw an unexpected error
    const originalVerify = jwt.verify;
    jwt.verify = () => {
      throw new Error("unexpected error");
    };

    await expect(strategy.validateToken("dummyToken")).rejects.toBeInstanceOf(
      JWTUnknownError,
    );

    // Restore original
    jwt.verify = originalVerify;
  });

  it("should throw JWTSignError if signing fails", () => {
    const strategy = new StatelessJWTStrategy({
      secret: "validsecret",
      algorithm: "ES256",
      expiresIn: "1h",
    });

    // Mock jwt.sign to throw
    vi.spyOn(jwt, "sign").mockImplementation(() => {
      throw new Error("signing failed");
    });

    expect(() => strategy.generateToken({ sub: "user1" })).toThrow(
      JWTSignError,
    );

    // Restore mock
    vi.restoreAllMocks();
  });
});
