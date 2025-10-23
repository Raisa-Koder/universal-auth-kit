export interface AuthAdapter<TUser> {
  findUserByEmail(email: string): Promise<TUser | null>;
  validatePassword(user: TUser, password: string): Promise<boolean>;
  findUserByUsername(username: string): Promise<TUser | null>
  saveUser?(data: Partial<TUser>): Promise<TUser>;
}
