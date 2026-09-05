import bcrypt from "bcrypt";

import { AUTH_CONSTANTS } from "../auth.constants.js";

// ---------- | Hash Password | ----------

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, AUTH_CONSTANTS.PASSWORD.BCRYPT_SALT_ROUNDS);
};

// ---------- | Compare Password | ----------

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export { hashPassword, comparePassword };
