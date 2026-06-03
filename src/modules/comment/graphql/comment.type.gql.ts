import {GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString} from "graphql/type";
import {userGqlType} from "../../user/graphql/user.gql.type";
import {postGqlType} from "../../post/graphql/post.gql.type";

export const CommentGqlType = new GraphQLObjectType({
    name: "CommentType",
    fields: {
        user: {
            type: userGqlType,
            resolve: (parent: any) => {
                return parent.userId;
            }
        },
        post: {
            type: postGqlType,
            resolve: (parent: any) => {
                return parent.postId;
            }
        },
        content: {type: GraphQLString},
        attachment: {type: GraphQLString},
        mentions: {type: new GraphQLList(userGqlType)},
        reactionsCount: {type: GraphQLInt},
    }
})