export interface RefreshTokenValidator<TResult> {
  validateRefreshToken(token: string): Promise<TResult>;
}

export interface RefreshTokenIssuer<TResult> {
  generateRefreshToken(payload: TResult): string;
}

export interface RefreshAccessHandler<TAccess, TRefresh> {
  refreshAccess(refreshToken: TRefresh, accessPayload: TAccess): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
}
