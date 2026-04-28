import { IUser } from "./user.interface";

declare module "express-serve-static-core" {
  // re-open
  interface Request {
    user: IUser;
  }
}
