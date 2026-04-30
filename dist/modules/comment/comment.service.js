"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const post_repository_1 = require("../../DB/models/post/post.repository");
const comment_repository_1 = require("../../DB/models/comment/comment.repository");
const common_1 = require("../../common");
class CommentService {
    postRepository;
    commentRepository;
    constructor(postRepository, commentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }
    async create(createCommentDTO, params, userId) {
        //postId check existence
        const postExist = await this.postRepository.getOne({ _id: params.postId }, {}, {});
        if (!postExist)
            throw new common_1.NotFoundException("Post not found");
        //if parentId >> reply check parentId
        if (params.parentId) {
            const parentCommentExist = await this.commentRepository.getOne({ _id: params.parentId }, {}, {});
            if (!parentCommentExist)
                throw new common_1.NotFoundException("Parent comment not found");
        }
        //if yes create comment
        this.commentRepository.create({
            ...createCommentDTO,
            ...params,
            userId,
        });
    }
    // method >> get >> not have body
    async getAll(params) {
        // params >> { postId, parentId }
        const comments = await this.commentRepository.getAll({
            postId: params.postId,
            parentId: params.parentId,
        });
        if (comments.length == 0)
            throw new common_1.NotFoundException("no comments");
        return comments;
    }
}
exports.default = new CommentService(new post_repository_1.PostRepository(), new comment_repository_1.CommentRepository());
