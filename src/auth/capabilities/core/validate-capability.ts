export interface TokenValidator<TResult> {
  validateToken(token: string): Promise<TResult>;
}