"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const post_repository_1 = require("../../DB/models/post/post.repository");
const common_1 = require("../../common");
const user_reaction_repository_1 = require("../../DB/models/user-reaction/user-reaction.repository");
class PostService {
    postRepository;
    userReactionRepository;
    constructor(postRepository, userReactionRepository) {
        this.postRepository = postRepository;
        this.userReactionRepository = userReactionRepository;
    }
    // data >> body >> dto
    async create(createPostDTO, userId) {
        // repository >> create post
        return await this.postRepository.create({ ...createPostDTO, userId }); //{ content, attachments, userId }
    }
    async addReaction(addReactionDTO, userId) {
        // check post existence
        const postExist = await this.postRepository.getOne({
            _id: addReactionDTO.postId,
        }, {}, {});
        if (!postExist) {
            throw new common_1.NotFoundException("Post not found");
        }
        // check user reaction
        const userReaction = await this.userReactionRepository.getOne({ onModel: common_1.ON_MODEL.Post, refId: addReactionDTO.postId, userId }, {}, {});
        // if no reaction >> create new reaction
        if (!userReaction) {
            await this.userReactionRepository.create({
                onModel: common_1.ON_MODEL.Post,
                refId: addReactionDTO.postId,
                userId,
                reaction: addReactionDTO.reaction,
            });
            await this.postRepository.updateOne({
                _id: addReactionDTO.postId,
            }, { $inc: { reactionsCount: 1 } });
            return;
        }
        // if same reaction >> remove reaction
        if (userReaction.reaction == addReactionDTO.reaction) {
            await this.userReactionRepository.deleteOne({ _id: userReaction._id });
            await this.postRepository.updateOne({
                _id: addReactionDTO.postId,
            }, { $inc: { reactionsCount: -1 } });
            return;
        }
        // if different reaction >> update reaction
        await this.userReactionRepository.updateOne({ _id: userReaction._id }, { reaction: addReactionDTO.reaction });
    }
}
exports.PostService = PostService;
exports.default = new PostService(new post_repository_1.PostRepository(), new user_reaction_repository_1.UserReactionRepository());
