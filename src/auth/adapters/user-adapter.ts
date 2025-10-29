export interface AuthAdapter<TUser> {
  validateUser(identifier: string, secret: string): Promise<TUser | null>;
}
