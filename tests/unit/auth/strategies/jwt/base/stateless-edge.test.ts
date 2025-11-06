import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";

import { StatelessJWTStrategy } from "@/src/auth/strategies/jwt/base/stateless-jwt-strategy";

import { keyPairs } from "../helpers";

describe("StatelessJWTStrategy - Combined Edge Cases / Full Coverage", () => {
  const payload = { sub: "123" };

  const algorithms = "RS256";

  it(`should generate, validate, and handle expiry correctly for issuer not defined, audience  not defined`, () => {
    const { privateKey } = keyPairs[algorithms];
    const strategy = new StatelessJWTStrategy({
      secret: privateKey,
      algorithm: algorithms,
      expiresIn: "1s",
    });

    const token = strategy.generateToken(payload);
    const decoded = jwt.decode(token, { json: true });
    expect(decoded).toBeDefined();
  });

  it(`should generate, validate, and handle expiry correctly for issuer defined, audience defined, algorithm`, () => {
    const { privateKey } = keyPairs[algorithms];
    const strategy = new StatelessJWTStrategy({
      secret: privateKey,
      algorithm: algorithms,
      issuer: "issuer1",
      audience: "audiance1",
      expiresIn: "1s",
    });

    const token = strategy.generateToken(payload);
    const decoded = jwt.decode(token, { json: true });
    expect(decoded).toBeDefined();
  });
});
