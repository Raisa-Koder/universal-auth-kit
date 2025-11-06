// tests/unit/auth/strategies/jwt/extensions/credential-bound.test.ts
import jwt from "jsonwebtoken";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InvalidCredentialsError } from "@/src/auth/strategies/jwt/base/errors";
import { CredentialBoundJWTStrategy } from "@/src/auth/strategies/jwt/extensions/credential-bound-jwt-strategy";

import {
  AdminAdapter,
  EditorAdapter,
  InvalidAdapter,
  runtimeClaimsExample,
} from "../../../mocks/mock-adapters";
import { mockUsers, User } from "../../../mocks/mock-users";
import { keyPairs, pickRandomAlgorithm } from "../helpers";

// Fake timers (optional, if testing expiry)
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("CredentialBoundJWTStrategy - authenticate()", () => {
  const credentialVariants = [
    {
      name: "admin user",
      adapter: AdminAdapter,
      credentials: { identifier: "valid_user", password: "valid_pass" },
      expectedUser: mockUsers.admin,
    },
    {
      name: "editor user",
      adapter: EditorAdapter,
      credentials: { identifier: "user2", password: "pass2" },
      expectedUser: mockUsers.editor,
    },
  ];

  for (const {
    name,
    adapter,
    credentials,
    expectedUser,
  } of credentialVariants) {
    it(`should authenticate and return token for ${name}`, async () => {
      const algo = pickRandomAlgorithm();
      const { privateKey, publicKey } = keyPairs[algo];

      const strategy = new CredentialBoundJWTStrategy<typeof expectedUser>(
        {
          secret: privateKey,
          algorithm: algo,
          expiresIn: "1h",
        },
        new adapter(),
      );

      const result = await strategy.authenticate(credentials);
      expect(result.user).toEqual(expectedUser);
      expect(typeof result.token).toBe("string");

      const decoded = jwt.verify(result.token, publicKey, {
        algorithms: [algo],
      });
      expect(decoded).toMatchObject(expectedUser);
    });
  }

  it("should merge runtime claims into token payload", async () => {
    const algo = pickRandomAlgorithm();
    const { privateKey, publicKey } = keyPairs[algo];
    const strategy = new CredentialBoundJWTStrategy<typeof mockUsers.editor>(
      {
        secret: privateKey,
        algorithm: algo,
        expiresIn: "1h",
      },
      new EditorAdapter(),
    );

    const result = await strategy.authenticate({
      identifier: "user2",
      password: "pass2",
      runtimeClaims: runtimeClaimsExample,
    });
    expect(result.user).toEqual(mockUsers.editor);

    const decoded = jwt.verify(result.token, publicKey, {
      algorithms: [algo],
    }) as User;

    // User fields remain
    expect(decoded.id).toBe(mockUsers.editor.id);
    expect(decoded.email).toBe(mockUsers.editor.email);

    // Runtime claims overwrite/merge
    expect(decoded.role).toBe(runtimeClaimsExample.role);
    expect(decoded.temporary).toBe(true);
  });

  it("should throw InvalidCredentialsError for invalid credentials", async () => {
    const algo = pickRandomAlgorithm();
    const { privateKey } = keyPairs[algo];
    const strategy = new CredentialBoundJWTStrategy(
      { secret: privateKey, algorithm: algo, expiresIn: "1h" },
      new InvalidAdapter(),
    );

    await expect(
      strategy.authenticate({ identifier: "bad", password: "bad" }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
