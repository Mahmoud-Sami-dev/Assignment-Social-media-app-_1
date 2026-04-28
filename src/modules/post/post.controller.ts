import { NextFunction, Request, Response, Router } from "express";
import postService from "./post.service";
import { Types } from "mongoose";
import { isValid } from "../../middleware";
import { createPostSchema } from "./post.dto";

const router = Router();
//method = post >> create , url /post
router.post(
  "/",
  isValid(createPostSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const createdPost = await postService.create(
      req.body,
      new Types.ObjectId("69ec9daafc88cd3b49827d8d"),
    );

    return res.status(201).json({
      message: "post created successfully",
      success: true,
      data: { createdPost },
    });
  },
);

router.post(
  "/reaction",
  async (req: Request, res: Response, next: NextFunction) => {
    await postService.addReaction(
      req.body,
      new Types.ObjectId("69ecbb7f9a010420b41c3503"),
    );
    return res.sendStatus(204); 
  },
);

export default router;
