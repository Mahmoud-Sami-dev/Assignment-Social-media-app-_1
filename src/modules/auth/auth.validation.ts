// joi & @types/joi
// zod >> implemented TS
import z from "zod";
import { generalFields } from "../../common";
export const signupSchema = z.object({
  email: generalFields.email,
  gender: generalFields.gender,
  password: generalFields.password,
  userName: generalFields.userName,
  phoneNumber: generalFields.phoneNumber,
});

export const changePasswordSchema = z.object({
  email: generalFields.email,
  oldPassword: generalFields.password,
  newPassword: generalFields.password,
});
