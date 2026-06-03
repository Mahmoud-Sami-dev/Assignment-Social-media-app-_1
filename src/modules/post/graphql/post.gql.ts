import {PostType} from "./post.type";
import {getPosts} from "./post.service";

export const postQuery = {
    post: {
        type: PostType,
        resolve: getPosts
    },

}
export const postMutation = {}