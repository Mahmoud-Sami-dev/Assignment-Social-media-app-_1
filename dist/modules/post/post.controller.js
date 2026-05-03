"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_service_1 = __importDefault(require("./post.service"));
const mongoose_1 = require("mongoose");
const middleware_1 = require("../../middleware");
const post_dto_1 = require("./post.dto");
const comment_controller_1 = __importDefault(require("../comment/comment.controller"));
const router = (0, express_1.Router)(); //sub app
router.use("/:postId/comment", comment_controller_1.default);
//method = post >> create , url /post
router.post("/", (0, middleware_1.isValid)(post_dto_1.createPostSchema), async (req, res, next) => {
    const createdPost = await post_service_1.default.create(req.body, new mongoose_1.Types.ObjectId("69ec9daafc88cd3b49827d8d"));
    return res.status(201).json({
        message: "post created successfully",
        success: true,
        data: { createdPost },
    });
});
router.post("/reaction", async (req, res, next) => {
    await post_service_1.default.addReaction(req.body, new mongoose_1.Types.ObjectId("69ecbb7f9a010420b41c3503"));
    return res.sendStatus(204);
});
exports.default = router;
