import { model, Schema } from "mongoose";
import { IPost } from "../../../common";

const schema = new Schema<IPost>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: String, //optional
    attachments: [String], // optional
    reactionsCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

export const Post = model("Post", schema);
