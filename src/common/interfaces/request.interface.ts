import {Types} from "mongoose";

// IRequest >> Request Table
export interface IRequest{
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
}