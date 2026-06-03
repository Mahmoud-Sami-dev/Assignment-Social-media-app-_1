import {postGqlType} from "./post.gql.type";
import postService from "../post.service";
import {Types} from "mongoose";

export const postGQLQuery = {
    post: {
        type: postGqlType,


        resolve: async () => {
            return await postService.getPost(new Types.ObjectId("69edee43c5f70e4f898345ea"))
        }
    }
}