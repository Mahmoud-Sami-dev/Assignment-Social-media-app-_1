import { Types } from "mongoose";

export interface IPost {
  userId: Types.ObjectId;
  content?: string;
  attachments?: string[]; //[url, url, url, ...]
  reactionsCount: number; // calculated field >> user reactions length
  commentsCount: number; // calculated field >> user comments length
  shareCount: number; // calculated field >> user share length // point search
}
