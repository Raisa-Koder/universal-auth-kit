export class JWTError extends Error {
  constructor(
    message: string,
    public code: string = "JWT_ERROR",
    public cause?: Error
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class JWTInvalidError extends JWTError {
  constructor(cause?: Error) {
    super("Invalid JWT token", "JWT_INVALID", cause);
  }
}

export class JWTConfigError extends JWTError {
  constructor(cause?: Error) {
    super("Invalid JWT configuration", "JWT_CONFIG_INVALID", cause);
    this.name = "JWTConfigError";
  }
}

export class JWTExpiredError extends JWTError {
  constructor(cause?: Error) {
    super("JWT token has expired", "JWT_EXPIRED", cause);
  }
}

export class JWTSignError extends JWTError {
  constructor(cause?: Error) {
    super("Failed to sign JWT token", "JWT_SIGN_ERROR", cause);
  }
}

export class JWTUnknownError extends JWTError {
  constructor(cause?: Error) {
    super("Unknown JWT error", "JWT_UNKNOWN", cause);
  }
}

export class InvalidCredentialsError extends JWTError {
  constructor(cause?: Error) {
    super("Invalid credentials", "INVALID_CREDENTIALS", cause);
  }
}
