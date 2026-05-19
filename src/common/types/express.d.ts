import {IUser} from "../interfaces";

declare module "express-serve-static-core" {
  // re-open
  interface Request {
    user: IUser;
  }
}
