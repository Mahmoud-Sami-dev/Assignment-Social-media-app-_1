import {Types} from "mongoose";
import {ICloudProvider} from "../../common/cloud/cloud.interface";
import {s3CloudProvider} from "../../common/cloud/s3/init";
import {userRepository, UserRepository} from "../../DB/models/user/user.repository";
import {NotFoundException} from "../../common";

class UserService {
    constructor(private readonly cloudProvider: ICloudProvider, private readonly userRepository: UserRepository) {
    }

    async uploadProfilePic(file: Express.Multer.File, userId: Types.ObjectId) {
        // 1. upload to s3
        const key = await this.cloudProvider.uploadFile(file, `users/${userId.toString()}`);
        // 2. update DB
        const user = await this.userRepository.updateOne(
            {_id: userId},
            {profilePic: key},
            {returnDocument: "before"}
        );
        if (!user) throw new NotFoundException("user not found");
        // 3. delete old profilePic
        if (user.profilePic) await this.cloudProvider.deleteFile(user.profilePic)
    }

    async profile(userId: Types.ObjectId) {
        // @ts-ignore
        return await this.userRepository.getOne({_id: userId})
    }
}

export default new UserService(s3CloudProvider, userRepository);