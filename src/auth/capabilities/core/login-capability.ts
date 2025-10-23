export interface CredentialLogin<TCredentials, TResult> {
  login(credentials: TCredentials): Promise<TResult>;
}