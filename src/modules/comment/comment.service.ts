import { Types } from "mongoose";
import { CreateCommentDTO } from "./comment.dto";
import { PostRepository } from "../../DB/models/post/post.repository";
import { CommentRepository } from "../../DB/models/comment/comment.repository";
import { NotFoundException } from "../../common";

class CommentService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async create(
    createCommentDTO: CreateCommentDTO,
    params: any,
    userId: Types.ObjectId,
  ) {
    //postId check existence
    const postExist = await this.postRepository.getOne(
      { _id: params.postId },
      {},
      {},
    );
    if (!postExist) throw new NotFoundException("Post not found");
    //if parentId >> reply check parentId
    if (params.parentId) {
      const parentCommentExist = await this.commentRepository.getOne(
        { _id: params.parentId },
        {},
        {},
      );
      if (!parentCommentExist)
        throw new NotFoundException("Parent comment not found");
    }
    //if yes create comment
    this.commentRepository.create({
      ...createCommentDTO,
      ...params,
      userId,
    });
  }
  // method >> get >> not have body
  async getAll(params: any) {
    // params >> { postId, parentId }
    const comments = await this.commentRepository.getAll({
      postId: params.postId,
      parentId: params.parentId,
    });
    if(comments.length ==0)throw new NotFoundException("no comments")
    return comments;
  }
}

export default new CommentService(
  new PostRepository(),
  new CommentRepository(),
);
