import {GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString} from "graphql/type";
import {userGqlType} from "../../user/graphql/user.gql.type";

export const postGqlType = new GraphQLObjectType({
    name: "PostType",
    fields: {
        content: {type: GraphQLString},
        attachments: {type: new GraphQLList(GraphQLString)},
        reactionsCount: {type: GraphQLInt},
        commentsCount: {type: GraphQLInt},
        shareCount: {type: GraphQLInt},
        user: {
            type: userGqlType,
            resolve: (parent: any) => {
                return parent.userId
            }
        },
    }
})