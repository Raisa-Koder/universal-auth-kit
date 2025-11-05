// tests/auth/jwt/stateless-strategy.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";

import jwt from "jsonwebtoken";
import { StatelessJWTStrategy } from "@/src/auth/strategies/jwt/base/stateless-jwt-strategy";
import { JWTInvalidError } from "@/src/auth/strategies/jwt/base/errors";
import { keyPairs, pickRandomAlgorithm } from "../helpers";

// Fake timers setup for expiry tests
beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
});

describe("StatelessJWTStrategy - Issuer / Audience Combinations", () => {
  const combinations = [
    { issuer: "issuer1", audience: "aud1", desc: "both issuer and audience defined" },
    { issuer: "issuer2", desc: "only issuer defined" },
    { audience: "aud2", desc: "only audience defined" },
    { desc: "neither issuer nor audience defined" },
  ];

  combinations.forEach(({ issuer, audience, desc }) => {
    it(`should validate token correctly when ${desc}`, async () => {
      const algo = pickRandomAlgorithm();
      const { privateKey } = keyPairs[algo];
      const strategy = new StatelessJWTStrategy({
        secret: privateKey,
        algorithm: algo,
        issuer,
        audience,
        expiresIn: "1h",
      });

      const payload = { sub: "user1", role: "admin" };
      const token = strategy.generateToken(payload);

      const decoded = await strategy.validateToken(token);
      expect(decoded).toMatchObject(payload);
    });
  });

  it("should throw JWTInvalidError if token issuer does not match", async () => {
    const algo = pickRandomAlgorithm();
    const { privateKey } = keyPairs[algo];
    const strategy = new StatelessJWTStrategy({
      secret: privateKey,
      algorithm: algo,
      issuer: "correct-issuer",
      audience: "correct-audience",
    });

    // Generate token with mismatched issuer manually
    const token = jwt.sign({ sub: "user1" }, privateKey, {
      algorithm: algo,
      issuer: "wrong-issuer",
      audience: "correct-audience",
    });

    await expect(strategy.validateToken(token)).rejects.toBeInstanceOf(JWTInvalidError);
  });

  it("should throw JWTInvalidError if token audience does not match", async () => {
    const algo = pickRandomAlgorithm();
    const { privateKey } = keyPairs[algo];
    const strategy = new StatelessJWTStrategy({
      secret: privateKey,
      algorithm: algo,
      issuer: "correct-issuer",
      audience: "correct-audience",
    });

    // Generate token with mismatched audience manually
    const token = jwt.sign({ sub: "user1" }, privateKey, {
      algorithm: algo,
      issuer: "correct-issuer",
      audience: "wrong-audience",
    });

    await expect(strategy.validateToken(token)).rejects.toBeInstanceOf(JWTInvalidError);
  });
});