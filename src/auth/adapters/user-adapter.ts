export interface UserAdapter<TUser> {
  validateUser(identifier: string, secret: string): Promise<TUser | null>;
}
