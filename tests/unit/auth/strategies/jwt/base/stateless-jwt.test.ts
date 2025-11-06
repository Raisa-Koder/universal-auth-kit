// src/auth/jwt/stateless-jwt.test.ts
import jwt, { PrivateKey, PublicKey } from "jsonwebtoken";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  JWTConfigError,
  JWTExpiredError,
  JWTInvalidError,
  JWTSignError,
  JWTUnknownError,
} from "@/src/auth/strategies/jwt/base/errors";
import { StatelessJWTStrategy } from "@/src/auth/strategies/jwt/base/stateless-jwt-strategy";

import {
  ALGORITHMS,
  generateES256KeyPair,
  generateRS256KeyPair,
  keyPairs,
  pickRandomAlgorithm,
} from "../helpers";

interface TestPayload {
  sub: string;
  roles?: string[];
  meta?: Record<string, unknown>;
}

describe("StatelessJWTStrategy", () => {
  let algorithm: (typeof ALGORITHMS)[number];
  let keys: { publicKey: PublicKey; privateKey: PrivateKey };
  let strategy: StatelessJWTStrategy<TestPayload>;
  let payload: TestPayload;

  beforeEach(() => {
    algorithm = pickRandomAlgorithm();
    keys = keyPairs[algorithm];
    payload = { sub: "user123", roles: ["admin"], meta: { nested: true } };
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // -------------------------------
  // Constructor & Config Validation
  // -------------------------------
  describe("Constructor & config validation", () => {
    it("should throw JWTConfigError for empty config", () => {
      expect(() => new StatelessJWTStrategy({})).toThrow(JWTConfigError);
    });

    it("should initialize correctly with valid config", () => {
      const config = { secret: keys.privateKey, algorithm, expiresIn: "1h" };
      strategy = new StatelessJWTStrategy<TestPayload>(config);
      expect(strategy).toBeInstanceOf(StatelessJWTStrategy);
    });
  });

  // -------------------------------
  // Token Generation
  // -------------------------------
  describe("generateToken", () => {
    beforeEach(() => {
      strategy = new StatelessJWTStrategy<TestPayload>({
        secret: keys.privateKey,
        algorithm,
        expiresIn: "1h",
        issuer: "issuer",
        audience: "audience",
      });
    });

    it("should generate a valid token", () => {
      const token = strategy.generateToken(payload);
      expect(typeof token).toBe("string");

      const decoded = jwt.verify(token, keys.publicKey, {
        algorithms: [algorithm],
        issuer: "issuer",
        audience: "audience",
      }) as TestPayload;
      expect(decoded.sub).toBe(payload.sub);
      expect(decoded.roles).toEqual(payload.roles);
      expect(decoded.meta).toEqual(payload.meta);
    });

    it("should throw JWTSignError if signing fails", () => {
      vi.spyOn(jwt, "sign").mockImplementation(() => {
        throw new Error("sign failed");
      });
      expect(() => strategy.generateToken(payload)).toThrow(JWTSignError);
    });
  });

  // -------------------------------
  // Token Validation
  // -------------------------------
  describe("validateToken", () => {
    beforeEach(() => {
      strategy = new StatelessJWTStrategy<TestPayload>({
        secret: keys.privateKey,
        algorithm,
        expiresIn: "1s",
        issuer: "issuer",
        audience: "audience",
      });
    });

    it("should validate a valid token", async () => {
      const token = strategy.generateToken(payload);
      const decoded = await strategy.validateToken(token);
      expect(decoded.sub).toBe(payload.sub);
    });

    it("should throw JWTExpiredError for expired token", async () => {
      const token = strategy.generateToken(payload);
      vi.useFakeTimers();
      vi.advanceTimersByTime(2000); // 2s > 1s expiration
      await expect(strategy.validateToken(token)).rejects.toThrow(
        JWTExpiredError,
      );
      vi.useRealTimers();
    });

    it("should throw JWTInvalidError for malformed token", async () => {
      await expect(strategy.validateToken("invalid.token")).rejects.toThrow(
        JWTInvalidError,
      );
    });

    it("should throw JWTInvalidError for invalid signature", async () => {
      const token = strategy.generateToken(payload);

      // Generate a second key pair of the same algorithm to simulate signature mismatch
      const { privateKey: wrongPrivateKey } =
        algorithm === "RS256" ? generateRS256KeyPair() : generateES256KeyPair();

      const wrongStrategy = new StatelessJWTStrategy<TestPayload>({
        secret: wrongPrivateKey,
        algorithm,
      });

      await expect(wrongStrategy.validateToken(token)).rejects.toThrow(
        JWTInvalidError,
      );
    });

    it("should throw JWTUnknownError for unexpected verification error", async () => {
      const spy = vi.spyOn(jwt, "verify").mockImplementation(() => {
        throw new Error("unexpected");
      });
      const token = strategy.generateToken(payload);
      await expect(strategy.validateToken(token)).rejects.toThrow(
        JWTUnknownError,
      );
      spy.mockRestore();
    });

    it("should throw JWTInvalidError for wrong issuer or audience", async () => {
      const token = strategy.generateToken(payload);
      const wrongStrategy = new StatelessJWTStrategy<TestPayload>({
        secret: keys.privateKey,
        algorithm,
        issuer: "wrong",
        audience: "wrong",
      });
      await expect(wrongStrategy.validateToken(token)).rejects.toThrow(
        JWTInvalidError,
      );
    });

    it("should throw the original exception if verify throws non-Error", async () => {
      const spy = vi.spyOn(jwt, "verify").mockImplementation(() => {
        throw 42 as unknown;
      });
      const token = strategy.generateToken(payload);
      await expect(strategy.validateToken(token)).rejects.toBe(42);
      spy.mockRestore();
    });
  });

  // -------------------------------
  // Complex Payloads
  // -------------------------------
  describe("Complex payloads", () => {
    it("should handle nested and array payloads", async () => {
      strategy = new StatelessJWTStrategy<TestPayload>({
        secret: keys.privateKey,
        algorithm,
        expiresIn: "1h",
      });
      const complexPayload: TestPayload = {
        sub: "user456",
        roles: ["admin", "editor"],
        meta: { nested: { a: 1, b: [1, 2, 3] } },
      };
      const token = strategy.generateToken(complexPayload);
      const decoded = await strategy.validateToken(token);
      expect(decoded.meta).toEqual(complexPayload.meta);
    });
  });
});
