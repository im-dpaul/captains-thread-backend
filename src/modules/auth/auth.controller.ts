import type { Request, Response } from "express";

import { HTTP_STATUS } from "../../constants/http.constants.js";
import ApiResponse from "../../utils/ApiResponse.js";
import authService from "./auth.service.js";

// ---------- | Register | ----------

const register = async (req: Request, res: Response): Promise<void> => {
  const user = await authService.register(req.body);

  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, user, "User registered successfully."));
};

// ---------- | Login | ----------

const login = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.login(req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, "Login successful."));
};

// ---------- | Logout | ----------

const logout = async (req: Request, res: Response): Promise<void> => {
  await authService.logout(req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, "Logout successful."));
};

// ---------- | Exports | ----------

export { login, register, logout };
