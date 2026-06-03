import {UserType} from "./user.type";
import {createUser, getUser} from "./user.service";
import {GraphQLID, GraphQLString} from "graphql/type";

export const userQuery = {
    user: {
        type: UserType,
        resolve: getUser
    }
}

export const userMutation = {
    createUser: {
        type: UserType,
        args: {
            id: {type: GraphQLID},
            name: {type: GraphQLString},
            email: {type: GraphQLString},
            password: {type: GraphQLString},
            phoneNumber: {type: GraphQLString},
        },
        resolve: createUser
    }
}