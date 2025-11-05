// src/auth/jwt/types.ts
import type { SignOptions, Algorithm } from "jsonwebtoken";
import { z } from "zod";

export const AllowedAlgorithms: Algorithm[] = ["RS256", "ES256"];

export const JwtConfigSchema = z.object({
  secret: z.string().min(1, "JWT secret is required"),
  algorithm: z.enum(["RS256", "ES256"]).default("RS256"),
  issuer: z.string().optional(),
  audience: z.string().optional(),
  expiresIn: z.union([z.string(), z.number()]).default("1h"),
  refreshSecret: z.string().optional(),
  refreshExpiresIn: z.string().optional(),
});

export type JwtConfig = z.infer<typeof JwtConfigSchema>;

export interface RefreshTokenPayload {
  sub: string;
  type: "refresh";
}

export interface StatelessRefreshableJWTConfig extends JwtConfig {    
  refreshSecret: string;
  refreshExpiresIn?: string;   
}

export interface CredentialBoundJWTCredentials {
  identifier: string;
  password: string;
  runtimeClaims?: Record<string, any>;
}

export interface CredentialBoundJWTResult<TUser extends { id: string; [key: string]: any }> {
  token: string;
  user: TUser;
}