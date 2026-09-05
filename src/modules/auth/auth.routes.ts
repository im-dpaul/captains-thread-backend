import { Router } from "express";

import validate from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import { login, register } from "./auth.controller.js";

import { loginSchema, registerSchema } from "./auth.validation.js";

// ---------- | Router | ----------

const router = Router();

// ---------- | Register | ----------

router.post("/register", validate(registerSchema, "body"), asyncHandler(register));

// ---------- | Login | ----------

router.post("/login", validate(loginSchema, "body"), asyncHandler(login));

export default router;
