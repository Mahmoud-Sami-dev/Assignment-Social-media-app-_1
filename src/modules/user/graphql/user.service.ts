import {User} from "../../../DB/models/user/user.model";

export const getUser = async () => {
    return {
        _id: 1,
        name: "mahmoud",
        email: "mah@gmail.com",
        password: "123456",
        phoneNumber: "01038014590"
    }

}


export const createUser = async (parent: any, args: any) => {
    return await User.create(args)
}