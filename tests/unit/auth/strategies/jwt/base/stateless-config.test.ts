import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { JWTConfigError } from "@/src/auth/strategies/jwt/base/errors";
import { StatelessJWTStrategy } from "@/src/auth/strategies/jwt/base/stateless-jwt-strategy";
import {
  JwtConfig,
  JwtConfigSchema,
} from "@/src/auth/strategies/jwt/base/types";

import { keyPairs, pickRandomAlgorithm } from "../helpers";

// Fake timers setup for expiry tests
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("StatelessJWTStrategy - Constructor / Config Validation", () => {
  it("should throw an error for empty secret", () => {
    const algo = pickRandomAlgorithm();
    expect(() => {
      new StatelessJWTStrategy({
        secret: "",
        algorithm: algo,
      });
    }).toThrowError(JWTConfigError);
  });

  it("should throw an error for unsupported algorithm", () => {
    // Type casting to bypass TS since zod schema enforces enum
    expect(() => {
      new StatelessJWTStrategy({
        secret: "mysecret",
        algorithm: "HS256",
      });
    }).toThrowError(JWTConfigError);
  });

  it("should successfully create strategy with valid config (minimal)", () => {
    const algo = pickRandomAlgorithm();
    const { privateKey } = keyPairs[algo];
    const strategy = new StatelessJWTStrategy({
      secret: privateKey,
      algorithm: algo,
    });
    expect(strategy).toBeInstanceOf(StatelessJWTStrategy);
    const token = strategy.generateToken({ sub: "123" });
    expect(typeof token).toBe("string");
  });

  it("should successfully create strategy with full config (issuer, audience, expiresIn)", async () => {
    const algo = pickRandomAlgorithm();
    const { privateKey } = keyPairs[algo];
    const strategy = new StatelessJWTStrategy({
      secret: privateKey,
      algorithm: algo,
      issuer: "test-issuer",
      audience: "test-audience",
      expiresIn: "2h",
    });
    expect(strategy).toBeInstanceOf(StatelessJWTStrategy);

    const token = strategy.generateToken({ sub: "123" });
    expect(typeof token).toBe("string");

    const decoded = await strategy.validateToken(token);
    expect(decoded.iss).toBe("test-issuer");
    expect(decoded.aud).toBe("test-audience");
  });

  it("should throw JWTConfigError if config parsing fails", () => {
    expect(() => new StatelessJWTStrategy({})).toThrow(JWTConfigError);
  });

  it("should throw JWTConfigError if config validation fails", () => {
    const fakeError = new ZodError([]) as unknown as ZodError<JwtConfig>;

    // Temporarily override safeParse to simulate failure
    const originalSafeParse = JwtConfigSchema.safeParse;
    JwtConfigSchema.safeParse = () => ({ success: false, error: fakeError });

    expect(() => new StatelessJWTStrategy({})).toThrow(JWTConfigError);

    // Restore original method
    JwtConfigSchema.safeParse = originalSafeParse;
  });
});
