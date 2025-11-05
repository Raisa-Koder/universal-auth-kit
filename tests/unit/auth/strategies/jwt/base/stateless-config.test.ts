import jwt from "jsonwebtoken"
import { describe, it, expect } from "vitest";
import { keyPairs, pickRandomAlgorithm } from "../helpers";
import { JWTConfigError } from "@/src/auth/strategies/jwt/base/errors";
import { StatelessJWTStrategy } from "@/src/auth/strategies/jwt/base/stateless-jwt-strategy";
import { JwtConfigSchema } from "@/src/auth/strategies/jwt/base/types";

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
        });
        expect(strategy).toBeInstanceOf(StatelessJWTStrategy);
        expect(strategy["config"].secret).toBe(privateKey);
    });

    it("should successfully create strategy with full config (issuer, audience, expiresIn)", () => {
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
        expect(strategy["config"].issuer).toBe("test-issuer");
        expect(strategy["config"].audience).toBe("test-audience");
        expect(strategy["config"].expiresIn).toBe("2h");
    });

    it("should throw JWTConfigError if config parsing fails", () => {
        expect(() => new StatelessJWTStrategy({})).toThrow(JWTConfigError);
    });

     it("should throw JWTConfigError if config validation fails", () => {
    // Temporarily override safeParse to simulate failure
    const originalSafeParse = JwtConfigSchema.safeParse;
    JwtConfigSchema.safeParse = () => ({ success: false, error: new Error("Invalid") }) as any;

    expect(() => new StatelessJWTStrategy({})).toThrow(JWTConfigError);

    // Restore original method
    JwtConfigSchema.safeParse = originalSafeParse;
  });
});