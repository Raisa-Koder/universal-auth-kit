[**authjoy**](../README.md)

---

[authjoy](../README.md) / JwtConfigSchema

# Variable: JwtConfigSchema

> `const` **JwtConfigSchema**: `ZodObject`\<\{ `algorithm`: `ZodDefault`\<`ZodEnum`\<\{ `ES256`: `"ES256"`; `RS256`: `"RS256"`; \}\>\>; `audience`: `ZodOptional`\<`ZodString`\>; `expiresIn`: `ZodDefault`\<`ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>\>; `issuer`: `ZodOptional`\<`ZodString`\>; `secret`: `ZodString`; \}, `$strip`\>

Defined in: [src/auth/strategies/jwt/base/types.ts:8](https://github.com/kodeforgeX/Authjoy/blob/097214837c1009862ed784f7af8795796b3d324c/src/auth/strategies/jwt/base/types.ts#L8)
