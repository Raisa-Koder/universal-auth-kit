export interface TokenIssuer<TResult> {
  generateToken(payload: TResult): string;
}
