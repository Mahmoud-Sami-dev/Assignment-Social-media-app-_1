import {model, Schema} from "mongoose";
import {IUserFriend} from "../../../common";

const schema = new Schema<IUserFriend>({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    friend: {type: Schema.Types.ObjectId, ref: "User", required: true},
    relationship: {type: Boolean, default: false},
}, {timestamps: true});

export const UserFriend = model("UserFriend", schema);