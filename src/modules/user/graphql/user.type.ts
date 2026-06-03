import {GraphQLID, GraphQLObjectType, GraphQLString} from "graphql/type";

export const UserType = new GraphQLObjectType({
    name: "UserQuery",
    fields: {
        _id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString, resolve: (parent: any) => {
                return parent.name;
            }
        },
        email: {
            type: GraphQLString, resolve: (parent: any) => {
                return parent.email;
            }
        },
        password: {
            type: GraphQLString, resolve: (parent: any) => {
                return parent.password;
            }
        },
        phoneNumber: {
            type: GraphQLString, resolve: (parent: any) => {
                return parent.phoneNumber;
            }
        }
    }
})