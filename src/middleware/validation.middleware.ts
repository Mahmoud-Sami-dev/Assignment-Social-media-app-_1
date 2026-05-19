import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { BadRequestException } from "../common";

export const isValid = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync(req.body);
    if (result.success == false) {
      // prepare errors
      const errMessages = result.error.issues.map((issue) => ({
        path: issue.path[0] as string, // property key
        message: issue.message,
      }));
      throw new BadRequestException("validation error", errMessages);
    }
    next();
  };
};
