"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comment = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true },
    parentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Comment" },
    mentions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    content: String,
    attachment: String,
    reactionsCount: { type: Number, default: 0 },
}, { timestamps: true });
exports.comment = (0, mongoose_1.model)("Comment", schema);
