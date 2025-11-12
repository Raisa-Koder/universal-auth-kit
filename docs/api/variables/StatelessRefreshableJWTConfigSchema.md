[**@kodeforgex/authjoy**](../README.md)

---

[@kodeforgex/authjoy](../README.md) / StatelessRefreshableJWTConfigSchema

# Variable: StatelessRefreshableJWTConfigSchema

> `const` **StatelessRefreshableJWTConfigSchema**: `ZodObject`\<\{ `algorithm`: `ZodDefault`\<`ZodEnum`\<\{ `ES256`: `"ES256"`; `RS256`: `"RS256"`; \}\>\>; `audience`: `ZodOptional`\<`ZodString`\>; `expiresIn`: `ZodDefault`\<`ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>\>; `issuer`: `ZodOptional`\<`ZodString`\>; `refreshExpiresIn`: `ZodDefault`\<`ZodOptional`\<`ZodString`\>\>; `refreshSecret`: `ZodString`; `secret`: `ZodString`; \}, `$strip`\>

Defined in: [src/auth/strategies/jwt/base/types.ts:23](https://github.com/kodeforgeX/Authjoy/blob/cf4486079614c9dd907fbc93cafdb95c4a96bf30/src/auth/strategies/jwt/base/types.ts#L23)
