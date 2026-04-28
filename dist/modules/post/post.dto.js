"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_1 = require("../../common");
exports.createPostSchema = zod_1.default
    .object({
    content: zod_1.default.string().optional(),
    attachments: zod_1.default.array(zod_1.default.string()).optional(),
})
    .refine((data) => {
    const { content, attachments } = data;
    if (!content && (!attachments || attachments.length === 0)) {
        throw new common_1.BadRequestException("Content or attachments must be provided");
    }
    return true;
});
