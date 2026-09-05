import crypto from "node:crypto";

// ---------- | Hash Refresh Token | ----------

const hashRefreshToken = (refreshToken: string): string => {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
};

// ---------- | Compare Refresh Token | ----------

const compareRefreshToken = (refreshToken: string, refreshTokenHash: string): boolean => {
  const hashedToken = hashRefreshToken(refreshToken);

  return crypto.timingSafeEqual(Buffer.from(hashedToken), Buffer.from(refreshTokenHash));
};

export { hashRefreshToken, compareRefreshToken };
