import {Types} from "mongoose";
import {requestRepository, RequestRepository} from "../../DB/models/request/request.repository";
import {BadRequestException, ConflictException, NotFoundException, UnAuthorizedException} from "../../common";
import {userFriendRepository, UserFriendRepository} from "../../DB/models/user-friend/user-friend.repository";

class RequestService {
    constructor(private readonly requestRepository: RequestRepository,
                private readonly userFriendRepository: UserFriendRepository
    ) {
    }

    /*
    @params userId >> sender [from token]
    @params receiverId >> receiver [from req.params]
     */
    async sendRequest(senderId: Types.ObjectId, receiverId: Types.ObjectId) {
        if (senderId.toString() == receiverId.toString()) throw new BadRequestException("not allowed to send request to yourself");
        //todo >> 1. check block users
        //2. check user friends
        const userFriendExists = await this.userFriendRepository.getOne({
            $or: [
                {user: senderId, friend: receiverId},
                {user: receiverId, friend: senderId}
            ]
        }, {}, {})
        if (userFriendExists) throw new BadRequestException("you are already friends")
        // 3. check have request [sender send or receiver]
        const requestExist = await this.requestRepository.getOne({
            $or: [
                {sender: senderId, receiver: receiverId},
                {sender: receiverId, receiver: senderId}
            ]
        }, {}, {})
        if (requestExist) {
            throw new ConflictException("request already exists");
        }
        // 4. if no, create request
        await this.requestRepository.create({
            sender: senderId,
            receiver: receiverId
        })
        // 5. todo >> send notification to receiver

    }

    /*
    * @params userId >> sender [from token]
    * @params id >> requestId
     * */

    async acceptRequest(userId: Types.ObjectId, id: Types.ObjectId) {
        // 1. check request existence
        const requestExist = await this.requestRepository.getOne({_id: id}, {}, {})
        if (!requestExist) throw new NotFoundException("Request not found");
        // 2. if yes , check receiver accept request
        if (!requestExist.receiver.equals(userId)) throw new UnAuthorizedException("you are not allowed to accept request");
        // 3. delete from request's table
        await this.requestRepository.deleteOne({_id: id});
        // 4. create user-friend table
        await this.userFriendRepository.create({
            user: userId,
            friend: requestExist.sender
        })
    }

    /**
     *
     * @param userId >> user login [token]
     * @param id >> request id
     */
    async declineRequest(userId: Types.ObjectId, id: Types.ObjectId) {
        // 1. check request existence
        const requestExist = await this.requestRepository.getOne({_id: id}, {}, {});
        if (!requestExist) throw new NotFoundException("Request not found");
        // 2. if yes, check sender or receiver === userId
        // ![requestExist.sender.toString(), requestExist.receiver.toString()].includes(userId.toString())
        if (!userId.equals(requestExist.sender) && !userId.equals(requestExist.receiver))
            throw new UnAuthorizedException("you are not allowed to decline or cancel request");
        // 3. delete from request's table
        await this.requestRepository.deleteOne({_id: id});
    }

    async declineRequest2(userId: Types.ObjectId, id: Types.ObjectId) {
        // 1. query to DB >> check existence and sender , receiver
        const {deletedCount} = await this.requestRepository.deleteOne({
            _id: id,
            $or: [{sender: userId}, {receiver: userId}]
        })
        // general error message >> throw err [request not found you not allowed to decline this request]
        if (deletedCount == 0)
            throw new BadRequestException("request not found you not allowed to decline this request")

    }

    /**
     *
     * @param userId >> user loggedIn [token]
     * @param friendId
     */
    // async removeFriend(userId: Types.ObjectId, friendId: Types.ObjectId) {
    //     // 1. check user friend existence
    //     const userFriendExist = await this.userFriendRepository.getOne({
    //         $or: [
    //             {user: userId, friend: friendId},
    //             {user: friendId, friend: userId}
    //         ]
    //     }, {}, {});
    //     if (!userFriendExist) throw new NotFoundException("you are not allowed to remove request");
    //     // 2. delete from user friend table
    //     await this.requestRepository.deleteOne({_id: userFriendExist._id});
    // }

    async removeFriend(userId: Types.ObjectId, friendId: Types.ObjectId) {
        if (userId.equals(friendId)) throw new BadRequestException("you are not allowed to remove yourself")
        const {deletedCount} = await this.userFriendRepository.deleteOne({
            $or: [
                {user: userId, friend: friendId},
                {user: friendId, friend: userId}
            ]
        });
        if (deletedCount == 0)
            throw new NotFoundException("you are not friends")
    }
}

// todo >> apply DI
export default new RequestService(requestRepository, userFriendRepository);