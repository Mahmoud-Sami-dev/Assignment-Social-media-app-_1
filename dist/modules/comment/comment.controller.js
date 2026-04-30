"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_service_1 = __importDefault(require("./comment.service"));
const mongoose_1 = require("mongoose");
const common_1 = require("../../common");
const comment_repository_1 = require("../../DB/models/comment/comment.repository");
//express 4.x.x >> /:parentId?
//express 5.x.x >> {/:parentId}
const router = (0, express_1.Router)();
router.post("/add-reaction", 
//todo: auth,
//todo: file upload
//todo: validation
async (req, res, next) => {
    await (0, common_1.addReaction)(req.body, new mongoose_1.Types.ObjectId("69ec9daafc88cd3b49827d8d"), comment_repository_1.commentRepo);
    // send response
    res.sendStatus(204);
});
//url= /comment/postId/parentId >> parentId is optional
//url= /comment/postId
router.post("/:postId{/:parentId}", 
//todo: auth,
//todo: file upload
//todo: validation
async (req, res, next) => {
    await comment_service_1.default.create(req.body, req.params, new mongoose_1.Types.ObjectId("69ec9daafc88cd3b49827d8d"));
    // send response
    res.sendStatus(204);
});
//url= /comment/postId/parentId >> replies on parent comment
//url= /comment/postId >> top level comments
router.get("/:postId{/:parentId}", async (req, res, next) => {
    const comments = await comment_service_1.default.getAll(req.params);
    // send response
    res.status(200).json({ success: true, data: comments });
});
exports.default = router;
