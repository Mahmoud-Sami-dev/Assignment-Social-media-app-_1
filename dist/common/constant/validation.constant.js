"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = void 0;
const zod_1 = __importDefault(require("zod"));
const enums_1 = require("../enums");
exports.generalFields = {
    email: zod_1.default.email({ message: "email is required" }),
    gender: zod_1.default.enum(enums_1.SYS_GENDER, { message: "must be a valid gender" }).optional(),
    password: zod_1.default
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    userName: zod_1.default.string({ message: "username is required" }).min(2).max(30),
    phoneNumber: zod_1.default.string().regex(/^(00201|01|\+20)[0125]{1}[0-9]{8}$/),
};
