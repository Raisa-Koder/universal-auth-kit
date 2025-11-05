// tests/auth/jwt/stateless-strategy.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";

import jwt from "jsonwebtoken";
import { StatelessJWTStrategy } from "@/src/auth/strategies/jwt/base/stateless-jwt-strategy";
import { keyPairs, pickRandomAlgorithm } from "../helpers";

// Fake timers setup for expiry tests
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("StatelessJWTStrategy - Token Generation and Basic Validation", () => {
  const payloadVariants = [
    { name: "flat object", payload: { sub: "user1", email: "test@example.com" } },
    { name: "nested object", payload: { sub: "user2", profile: { name: "Alice", roles: ["admin", "user"] } } },
    { name: "mixed types", payload: { sub: "user3", active: true, count: 42, tags: ["x", "y"] } },
    { name: "empty object", payload: {} },
  ];

  payloadVariants.forEach(({ name, payload }) => {
    it(`should generate and validate token for ${name}`, async () => {
      const algo = pickRandomAlgorithm();
      const { privateKey } = keyPairs[algo];
      const strategy = new StatelessJWTStrategy({
        secret: privateKey,
        algorithm: algo,
        issuer: "issuer",
        audience: "audience",
        expiresIn: "1h",
      });

      // Generate token
      const token = strategy.generateToken(payload as any);
      expect(typeof token).toBe("string");

      // Validate token
      const decoded = await strategy.validateToken(token);
      expect(decoded).toMatchObject(payload);
    });
  });
});
