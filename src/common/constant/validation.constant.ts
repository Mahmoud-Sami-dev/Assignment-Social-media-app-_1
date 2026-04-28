import z from "zod";
import { SYS_GENDER } from "../enums";

export const generalFields = {
  email: z.email({ message: "email is required" }),
  gender: z.enum(SYS_GENDER, { message: "must be a valid gender" }).optional(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    ),
  userName: z.string({ message: "username is required" }).min(2).max(30),
  phoneNumber: z.string().regex(/^(00201|01|\+20)[0125]{1}[0-9]{8}$/),
};
