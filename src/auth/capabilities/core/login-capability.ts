export interface CredentialLogin<TCredentials, TResult> {
  authenticate(credentials: TCredentials): Promise<TResult>;
}
