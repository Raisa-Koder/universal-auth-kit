// src/auth/jwt/extension/stateless-refresh.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import jwt, { PrivateKey, PublicKey } from "jsonwebtoken";
import { keyPairs, pickRandomAlgorithm } from "../helpers";
import { StatelessRefreshableJWTStrategy } from "@/src/auth/strategies/jwt/extensions/stateless-refreshable-jwt-strategy";
import { JWTConfigError, JWTExpiredError, JWTInvalidError, JWTSignError } from "@/src/auth/strategies/jwt/base/errors";
import { StatelessRefreshableJWTConfigSchema } from "@/src/auth/strategies/jwt/base/types";

type UserPayload = { id: string; name: string };

describe("StatelessRefreshableJWTStrategy", () => {
    let algorithm: "RS256" | "ES256";
    let keys: { publicKey: PublicKey; privateKey: PrivateKey };

    beforeEach(() => {
        algorithm = pickRandomAlgorithm();
        keys = keyPairs[algorithm];
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    // -------------------------------
    // Constructor & Config Validation
    // -------------------------------
    describe("Constructor & config validation", () => {
        it("should throw JWTConfigError for invalid config", () => {
            expect(() => new StatelessRefreshableJWTStrategy({} as any)).toThrow(JWTConfigError);
        });

        it("should initialize correctly with valid config", () => {
            const config = StatelessRefreshableJWTConfigSchema.parse({
                secret: keys.privateKey,
                algorithm,
                refreshSecret: keys.privateKey,
            });

            const strategy = new StatelessRefreshableJWTStrategy<UserPayload>(config);
            expect(strategy).toBeInstanceOf(StatelessRefreshableJWTStrategy);
        });
    });

    // -------------------------------
    // Refresh Token Generation & Validation
    // -------------------------------
    describe("Refresh token generation & validation", () => {
        let strategy: StatelessRefreshableJWTStrategy<UserPayload>;
        const userId = "user123";

        beforeEach(() => {
            const config = StatelessRefreshableJWTConfigSchema.parse({
                secret: keys.privateKey,
                algorithm,
                refreshSecret: keys.privateKey,
            });
            strategy = new StatelessRefreshableJWTStrategy<UserPayload>(config);
        });

        it("should generate refresh token", () => {
            const token = strategy.generateRefreshToken(userId);
            expect(typeof token).toBe("string");
        });

        it("should validate a valid refresh token", async () => {
            const token = strategy.generateRefreshToken(userId);
            const payload = await strategy.validateRefreshToken(token);
            expect(payload).toMatchObject({ sub: userId, type: "refresh" });
        });

        it("should throw JWTSignError if signing fails", () => {
            vi.spyOn(jwt, "sign").mockImplementation(() => { throw new Error("sign failed"); });
            expect(() => strategy.generateRefreshToken(userId)).toThrow(JWTSignError);
        });

        it("should throw JWTInvalidError for malformed token", async () => {
            await expect(strategy.validateRefreshToken("invalid.token")).rejects.toThrow(JWTInvalidError);
        });

        it("should throw JWTInvalidError if token type is wrong", async () => {
            const wrongToken = jwt.sign({ sub: userId, type: "access" }, keys.privateKey, { algorithm });
            await expect(strategy.validateRefreshToken(wrongToken)).rejects.toThrow(JWTInvalidError);
        });

        it("should throw JWTExpiredError for expired token", async () => {
            vi.useFakeTimers();
            const config = StatelessRefreshableJWTConfigSchema.parse({
                secret: keys.privateKey,
                algorithm,
                refreshSecret: keys.privateKey,
                refreshExpiresIn: "1s",
            });
            strategy = new StatelessRefreshableJWTStrategy<UserPayload>(config);

            const token = strategy.generateRefreshToken(userId);
            vi.advanceTimersByTime(1500);

            await expect(strategy.validateRefreshToken(token)).rejects.toThrow(JWTExpiredError);
        });
    });

    // -------------------------------
    // Token Rotation (refreshAccess)
    // -------------------------------
    describe("Token rotation (refreshAccess)", () => {
        let strategy: StatelessRefreshableJWTStrategy<UserPayload>;
        const userPayload: UserPayload = { id: "user123", name: "Alice" };

        beforeEach(() => {
            const config = StatelessRefreshableJWTConfigSchema.parse({
                secret: keys.privateKey,
                algorithm,
                refreshSecret: keys.privateKey,
            });
            strategy = new StatelessRefreshableJWTStrategy<UserPayload>(config);
        });

        it("should rotate access and refresh tokens", async () => {
            const refreshToken = strategy.generateRefreshToken(userPayload.id);

            const tokens = await strategy.refreshAccess(userPayload, refreshToken);

            expect(typeof tokens.accessToken).toBe("string");
            expect(typeof tokens.refreshToken).toBe("string");

            // Validate new refresh token
            const payload = await strategy.validateRefreshToken(tokens.refreshToken);
            expect(payload.sub).toBe(userPayload.id);
        });

        it("should throw JWTInvalidError if jwt.verify returns a string", async () => {
            // Mock jwt.verify to return a string
            vi.spyOn(jwt, "verify").mockReturnValue("I am a string token" as any);

            await expect(strategy.validateRefreshToken("dummy.token")).rejects.toThrow(JWTInvalidError);
        });
    });
});
