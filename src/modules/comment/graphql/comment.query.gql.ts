import {CommentGqlType} from "./comment.type.gql";
import commentService from "../comment.service";
import {Types} from "mongoose";

export const commentGQLQuery = {
    comment: {
        type: CommentGqlType,
        resolve: async () => {
            return await commentService.getComment(new Types.ObjectId("69f28be92d8f5a9b67a62f03"))
        }
    }
}