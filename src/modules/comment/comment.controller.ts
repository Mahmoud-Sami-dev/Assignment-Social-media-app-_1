import { NextFunction, Request, Response, Router } from "express";
import commentService from "./comment.service";
import { Types } from "mongoose";
import { addReaction } from "../../common";
import { commentRepo } from "../../DB/models/comment/comment.repository";

//express 4.x.x >> /:parentId?
//express 5.x.x >> {/:parentId}
const router = Router({ mergeParams: true });
// /comment/add-reaction >> add reaction on comment
// /post/postId/comment/add-reaction
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
// /comment/:commentId>> reply
// /post/:postId/comment/:commentId >> reply
// /post/:postId/comment >> top level comment
//body >> {content, attachments} + params >> {comment} + {userId >> token} + postId

// merge params
router.post(
  "{/:parentId}",
  //todo: auth,
  //todo: file upload
  //todo: validation
  async (req: Request, res: Response, next: NextFunction) => {
    const createdComment = await commentService.create(
      req.body,
      req.params,
      new Types.ObjectId("69ec9daafc88cd3b49827d8d"),
    );
    // send response
    res.status(201).json({ data: createdComment }); //done >> no content
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

//search of DFS on comment tree >> find comment by id and delete it and all its children >> recursion or iteration with stack
//SQL >> ondelete --> cascade

router.delete( 
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    await commentService.delete(
      new Types.ObjectId(req.params.id as string),
      new Types.ObjectId("69ec9daafc88cd3b49827d8d"),
    );
    return res.sendStatus(204);
  },
);
export default router;
