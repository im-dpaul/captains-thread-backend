// ---------- | Authentication Constants | ----------

export const AUTH_CONSTANTS = {
  ACCESS_TOKEN: {
    DEFAULT_EXPIRATION: "15m",
  },

  REFRESH_TOKEN: {
    DEFAULT_EXPIRATION: "7d",
  },

  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    BCRYPT_SALT_ROUNDS: 12,
  },

  EMAIL_VERIFICATION: {
    TOKEN_LENGTH: 32,
    EXPIRATION_MINUTES: 30,
  },

  PASSWORD_RESET: {
    TOKEN_LENGTH: 32,
    EXPIRATION_MINUTES: 30,
  },

  SESSION: {
    MAX_SESSIONS_PER_USER: 5,
  },
} as const;
