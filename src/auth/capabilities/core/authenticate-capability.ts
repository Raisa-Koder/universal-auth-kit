export interface CredentialAuthenticator<TCredentials, TResult> {
  authenticate(credentials: TCredentials): Promise<TResult>;
}
