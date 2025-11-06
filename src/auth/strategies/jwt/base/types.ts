// src/auth/jwt/types.ts
import type { Algorithm } from "jsonwebtoken";

import { z } from "zod";

export const AllowedAlgorithms: Algorithm[] = ["RS256", "ES256"];

export const JwtConfigSchema = z.object({
  secret: z.string().min(1, "JWT secret is required"),
  algorithm: z.enum(["RS256", "ES256"]).default("RS256"),
  issuer: z.string().optional(),
  audience: z.string().optional(),
  expiresIn: z.union([z.string(), z.number()]).default("30s"),
});

export type JwtConfig = z.infer<typeof JwtConfigSchema>;

export interface RefreshTokenPayload {
  sub: string;
  type: "refresh";
}

export const StatelessRefreshableJWTConfigSchema = JwtConfigSchema.extend({
  refreshSecret: z.string().min(1, "Refresh secret is required"),
  refreshExpiresIn: z.string().optional().default("1h"),
});

export type StatelessRefreshableJWTConfig = z.infer<
  typeof StatelessRefreshableJWTConfigSchema
>;

export interface CredentialBoundJWTCredentials {
  identifier: string;
  password: string;
  runtimeClaims?: Record<string, unknown>;
}

export interface CredentialBoundJWTResult<
  TUser extends { id: string; [key: string]: unknown },
> {
  token: string;
  user: TUser;
}
