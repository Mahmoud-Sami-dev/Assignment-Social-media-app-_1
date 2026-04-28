import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import authService from "./auth.service";
import { changePasswordSchema, signupSchema } from "./auth.validation";
import { isValid } from "../../middleware";
import { success } from "zod";
const router = Router();
//signup
// auth/signup
router.post(
  "/signup",
  isValid(signupSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    //call service
    await authService.signup(req.body);
    //send response
    return res.status(201).json({
      message: "user created successfully",
      success: true,
    });
  },
);
//verify-account
router.post(
  "/verify-account",
  async (req: Request, res: Response, next: NextFunction) => {
    await authService.verifyAccount(req.body);
    return res
      .status(200)
      .json({ message: "user verified successfully", success: true });
  },
);
//send-otp
router.post(
  "/send-otp",
  async (req: Request, res: Response, next: NextFunction) => {
    await authService.sendOTP(req.body);
    return res
      .status(200)
      .json({ message: "resend otp successfully", success: true });
  },
);
//reset-password
router.patch(
  "/reset-password",
  async (req: Request, res: Response, next: NextFunction) => {
    await authService.resetPassword(req.body);
    return res
      .status(200)
      .json({ message: "reset password successfully", success: true });
  },
);
//login
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    await authService.login(req.body);
    return res.status(200).json({
      message: "Login successfully",
      success: true,
    });
  },
);
//change-password
router.patch(
  "/change-password",
  isValid(changePasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    await authService.changePassword(req.body);
    return res
      .status(200)
      .json({ message: "password changed successfully", success: true });
  },
);
export default router;
