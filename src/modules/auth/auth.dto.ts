// DTO >> data to object
import z from "zod";
import { SYS_GENDER } from "../../common";
import { signupSchema } from "./auth.validation";

// interfaces, class, types >> noun
// export interface SignupDTO {
//   email: string;
//   password: string;
//   userName: string;
//   phoneNumber?: string;
//   gender: SYS_GENDER;
// }

export type SignupDTO = z.infer<typeof signupSchema>;

export interface LoginDTO {
  email: string;
  password: string;
}

export interface VerifyAccountDTO {
  otp: string;
  email: string;
}

export interface SendOtpDTO {
  email: string;
}

export interface ResetPasswordDTO {
  otp: string;
  email: string;
  newPassword: string;
}

export interface ChangePasswordDTO {
  email: string;
  oldPassword: string;
  newPassword: string;
}
