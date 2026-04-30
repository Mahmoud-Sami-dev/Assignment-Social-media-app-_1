import { NextFunction, Request, Response, Router } from "express";
import commentService from "./comment.service";
import { Types } from "mongoose";
import { addReaction } from "../../common";
import { commentRepo } from "../../DB/models/comment/comment.repository";

//express 4.x.x >> /:parentId?
//express 5.x.x >> {/:parentId}
const router = Router();

router.post(
  "/add-reaction",
  //todo: auth,
  //todo: file upload
  //todo: validation
  async (req: Request, res: Response, next: NextFunction) => {
    await addReaction(
      req.body,
      new Types.ObjectId("69ec9daafc88cd3b49827d8d"),
      commentRepo,
    );
    // send response
    res.sendStatus(204);
  },
);
//url= /comment/postId/parentId >> parentId is optional
//url= /comment/postId
router.post(
  "/:postId{/:parentId}",
  //todo: auth,
  //todo: file upload
  //todo: validation
  async (req: Request, res: Response, next: NextFunction) => {
    await commentService.create(
      req.body,
      req.params,
      new Types.ObjectId("69ec9daafc88cd3b49827d8d"),
    );
    // send response
    res.sendStatus(204);
  },
);

//url= /comment/postId/parentId >> replies on parent comment
//url= /comment/postId >> top level comments
router.get(
  "/:postId{/:parentId}",
  async (req: Request, res: Response, next: NextFunction) => {
    const comments = await commentService.getAll(req.params);
    // send response
    res.status(200).json({ success: true, data: comments });
  },
);

export default router;
