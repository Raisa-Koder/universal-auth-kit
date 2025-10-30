export type JwtAlgorithm =
  | 'HS256' | 'HS384' | 'HS512'
  | 'RS256' | 'RS384' | 'RS512'
  | 'ES256' | 'ES384' | 'ES512'
  | 'PS256' | 'PS384' | 'PS512'
  | 'none';

export interface JwtConfig {
  secret: string;             
  expiresIn?: string;          
  algorithm?: JwtAlgorithm;
}


export interface RefreshTokenPayload {
  sub: string;         
  type: "refresh";      
}

export interface StatelessRefreshableJWTConfig extends JwtConfig {    
  refreshSecret: string;
  refreshExpiresIn?: string;   
}
