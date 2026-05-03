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
        if (params.postId) {
            const postExist = await this.postRepository.getOne({ _id: params.postId }, {}, {});
            if (!postExist)
                throw new common_1.NotFoundException("Post not found");
        }
        //if parentId >> reply check parentId
        let parentCommentExist = undefined;
        if (params.parentId) {
            parentCommentExist = await this.commentRepository.getOne({ _id: params.parentId }, {}, {});
            if (!parentCommentExist)
                throw new common_1.NotFoundException("Parent comment not found");
        }
        //if yes create comment
        return await this.commentRepository.create({
            ...createCommentDTO,
            ...params, //{postId:1, parentId:2},{parentId:2}
            userId,
            postId: params.postId || parentCommentExist?.postId,
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
    // delete comment
    async delete(id, userId) {
        //check comment existence
        const commentExist = await this.commentRepository.getOne({ _id: id }, {}, { populate: [{ path: "postId" }] }); // {} | null
        if (!commentExist)
            throw new common_1.NotFoundException("comment not found");
        //{_id,content, attachment, userId,parentId:1, postId:[{userid:1}]}
        //commentAuthor comment.userId
        let commentAuthor = commentExist.userId.toString();
        //comment.postId
        //postRepository.getOne(_id:comment.postId)
        //postAuthor post.userId
        let postAuthor = commentExist.postId[0]?.userId.toString();
        if (![postAuthor, commentAuthor].includes(userId.toString())) {
            //userId != commentAuthor && userId != postAuthor
            throw new common_1.UnAuthorizedException("you are not allowed to delete this comment");
        }
        //delete comment
        await this.commentRepository.deleteOne({ _id: id });
        // mongoose middleware 
        //document method & query method
    }
}
exports.default = new CommentService(new post_repository_1.PostRepository(), new comment_repository_1.CommentRepository());
