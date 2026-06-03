import {userGqlType} from "./user.gql.type";
import userService from "../user.service";
import {Types} from "mongoose";

export const userGqlQuery = {
    user: {
        type: userGqlType,
        resolve: async () => {
            return await userService.profile(new Types.ObjectId("69ec9daafc88cd3b49827d8d"));
        },
    }
}