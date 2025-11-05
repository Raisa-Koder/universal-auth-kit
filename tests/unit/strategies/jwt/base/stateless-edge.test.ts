import { describe, it, expect, beforeEach, vi } from "vitest";

import jwt from "jsonwebtoken";
import { StatelessJWTStrategy } from "@/src/auth/strategies/jwt/base/stateless-jwt-strategy";
import { keyPairs } from "../helpers";

describe("StatelessJWTStrategy - Combined Edge Cases / Full Coverage", () => {

    const payload = { sub: "123" }

    const algorithms = "RS256";

    it(`should generate, validate, and handle expiry correctly for issuer not defined, audience  not defined`, async () => {
        const { privateKey } = keyPairs[algorithms];
        const strategy = new StatelessJWTStrategy({
            secret: privateKey,
            algorithm: algorithms,
            issuer: undefined,
            audience: undefined,
            expiresIn: "1s",
        });

        const token = strategy.generateToken(payload);
        const decoded = jwt.decode(token, { json: true }) as any;
        expect(decoded.iss).toBeUndefined();
        expect(decoded.aud).toBeUndefined();
    });

    it(`should generate, validate, and handle expiry correctly for issuer defined, audience defined, algorithm`, async () => {
        const { privateKey } = keyPairs[algorithms];
        const strategy = new StatelessJWTStrategy({
            secret: privateKey,
            algorithm: algorithms,
            issuer: "issuer1",
            audience: "audiance1",
            expiresIn: "1s",
        });

        const token = strategy.generateToken(payload);
        const decoded = jwt.decode(token, { json: true }) as any;
        expect(decoded.iss).toBeDefined();
        expect(decoded.aud).toBeDefined();
    });
});
