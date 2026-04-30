import { Types } from "mongoose";
import { NotFoundException } from "../utils";
import { AddReactionDTO } from "../dto";
import { UserReactionRepository } from "../../DB/models/user-reaction/user-reaction.repository";
import { PostRepository } from "../../DB/models/post/post.repository";
import { CommentRepository } from "../../DB/models/comment/comment.repository";
import { ON_MODEL } from "../enums";

function toModel(collectionName: string) {
  switch (collectionName) {
    case "posts":
      return ON_MODEL.Post;
    case "comments":
      return ON_MODEL.Comment;
    default:
      throw new NotFoundException("Document not found");
  }
}

export const addReaction = async (
  addReactionDTO: AddReactionDTO,
  userId: Types.ObjectId,
  repo: PostRepository | CommentRepository,
) => {
  // check document existence
  const docExist = await repo.getOne(
    {
      _id: addReactionDTO.id,
    },
    {},
    {},
  );
  if (!docExist) {
    throw new NotFoundException("Document not found");
  }
  const collectionName = docExist.collection.name;
  const userReactionRepository = new UserReactionRepository();
  // check user reaction
  const userReaction = await userReactionRepository.getOne(
    { onModel: toModel(collectionName), refId: addReactionDTO.id, userId },
    {},
    {},
  );
  // if no reaction >> create new reaction
  if (!userReaction) {
    await userReactionRepository.create({
      onModel: toModel(collectionName),
      refId: addReactionDTO.id,
      userId,
      reaction: addReactionDTO.reaction,
    });
    await repo.updateOne(
      {
        _id: addReactionDTO.id,
      },
      { $inc: { reactionsCount: 1 } },
    );
    return;
  }
  // if same reaction >> remove reaction
  if (userReaction.reaction == addReactionDTO.reaction) {
    await userReactionRepository.deleteOne({ _id: userReaction._id });
    await repo.updateOne(
      {
        _id: addReactionDTO.id,
      },
      { $inc: { reactionsCount: -1 } },
    );
    return;
  }
  // if different reaction >> update reaction
  await userReactionRepository.updateOne(
    { _id: userReaction._id },
    { reaction: addReactionDTO.reaction },
  );
};
