import { beforeEach, describe, expect, it, vi } from "vitest";

import { StatelessJWTStrategy } from "@/src/auth/strategies/jwt/base/stateless-jwt-strategy";

import { keyPairs, pickRandomAlgorithm } from "../helpers";

// Fake timers setup for expiry tests
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("StatelessJWTStrategy - Dynamic Algorithm Switching", () => {
  const algorithms = ["RS256", "ES256"] as const;

  for (const algo of algorithms) {
    it(`should generate and validate token correctly with ${algo}`, async () => {
      const { privateKey } = keyPairs[algo];
      const strategy = new StatelessJWTStrategy({
        secret: privateKey,
        algorithm: algo,
        issuer: "issuer",
        audience: "audience",
      });

      const payload = { sub: "user1", role: "tester" };
      const token = strategy.generateToken(payload);

      const decoded = await strategy.validateToken(token);
      expect(decoded).toMatchObject(payload);
    });
  }

  it("should pass when algorithms switch dynamically per iteration", async () => {
    const iterations = 5;
    for (let i = 0; i < iterations; i++) {
      const algo = pickRandomAlgorithm();
      const { privateKey } = keyPairs[algo];
      const strategy = new StatelessJWTStrategy({
        secret: privateKey,
        algorithm: algo,
      });

      const payload = { sub: `user${i}`, index: i };
      const token = strategy.generateToken(payload);

      const decoded = await strategy.validateToken(token);
      expect(decoded).toMatchObject(payload);
    }
  });
});
