import { Types } from "mongoose";
import { AddReactionDTO, CreatePostDTO } from "./post.dto";
import { PostRepository } from "../../DB/models/post/post.repository";
import { NotFoundException, ON_MODEL } from "../../common";
import { UserReactionRepository } from "../../DB/models/user-reaction/user-reaction.repository";

export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userReactionRepository: UserReactionRepository,
  ) {}
  // data >> body >> dto
  async create(createPostDTO: CreatePostDTO, userId: Types.ObjectId) {
    // repository >> create post
    return await this.postRepository.create({ ...createPostDTO, userId }); //{ content, attachments, userId }
  }

  async addReaction(addReactionDTO: AddReactionDTO, userId: Types.ObjectId) {
    // check post existence
    const postExist = await this.postRepository.getOne(
      {
        _id: addReactionDTO.postId,
      },
      {},
      {},
    );
    if (!postExist) {
      throw new NotFoundException("Post not found");
    }
    // check user reaction
    const userReaction = await this.userReactionRepository.getOne(
      { onModel: ON_MODEL.Post, refId: addReactionDTO.postId, userId },
      {},
      {},
    );
    // if no reaction >> create new reaction
    if (!userReaction) {
      await this.userReactionRepository.create({
        onModel: ON_MODEL.Post,
        refId: addReactionDTO.postId,
        userId,
        reaction: addReactionDTO.reaction,
      });
      await this.postRepository.updateOne(
        {
          _id: addReactionDTO.postId,
        },
        { $inc: { reactionsCount: 1 } },
      );
      return;
    }
    // if same reaction >> remove reaction
    if (userReaction.reaction == addReactionDTO.reaction) {
      await this.userReactionRepository.deleteOne({ _id: userReaction._id });
      await this.postRepository.updateOne(
        {
          _id: addReactionDTO.postId,
        },
        { $inc: { reactionsCount: -1 } },
      );
      return;
    }
    // if different reaction >> update reaction
    await this.userReactionRepository.updateOne(
      { _id: userReaction._id },
      { reaction: addReactionDTO.reaction },
    );
  }
}

export default new PostService(
  new PostRepository(),
  new UserReactionRepository(),
);
