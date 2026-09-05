import { Router } from "express";

import validate from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import { login, logout, register } from "./auth.controller.js";

import { loginSchema, refreshTokenSchema, registerSchema } from "./auth.validation.js";

// ---------- | Router | ----------

const router = Router();

// ---------- | Register | ----------

router.post("/register", validate(registerSchema, "body"), asyncHandler(register));
router.post("/login", validate(loginSchema, "body"), asyncHandler(login));
router.post("/logout", validate(refreshTokenSchema, "body"), asyncHandler(logout));

export default router;
