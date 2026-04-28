"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const auth_validation_1 = require("./auth.validation");
const middleware_1 = require("../../middleware");
const router = (0, express_1.Router)();
//signup
// auth/signup
router.post("/signup", (0, middleware_1.isValid)(auth_validation_1.signupSchema), async (req, res, next) => {
    //call service
    await auth_service_1.default.signup(req.body);
    //send response
    return res.status(201).json({
        message: "user created successfully",
        success: true,
    });
});
//verify-account
router.post("/verify-account", async (req, res, next) => {
    await auth_service_1.default.verifyAccount(req.body);
    return res
        .status(200)
        .json({ message: "user verified successfully", success: true });
});
//send-otp
router.post("/send-otp", async (req, res, next) => {
    await auth_service_1.default.sendOTP(req.body);
    return res
        .status(200)
        .json({ message: "resend otp successfully", success: true });
});
//reset-password
router.patch("/reset-password", async (req, res, next) => {
    await auth_service_1.default.resetPassword(req.body);
    return res
        .status(200)
        .json({ message: "reset password successfully", success: true });
});
//login
router.post("/login", async (req, res, next) => {
    await auth_service_1.default.login(req.body);
    return res.status(200).json({
        message: "Login successfully",
        success: true,
    });
});
//change-password
router.patch("/change-password", (0, middleware_1.isValid)(auth_validation_1.changePasswordSchema), async (req, res, next) => {
    await auth_service_1.default.changePassword(req.body);
    return res
        .status(200)
        .json({ message: "password changed successfully", success: true });
});
exports.default = router;
