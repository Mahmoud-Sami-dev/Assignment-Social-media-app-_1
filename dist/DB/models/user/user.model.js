"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../../../common");
const schema = new mongoose_1.Schema({
    userName: { type: String, required: true, minLength: 2, maxLength: 30 },
    email: { type: String, required: true },
    phoneNumber: { type: String },
    password: {
        type: String,
        required: function () {
            if (this.provider == common_1.SYS_PROVIDER.google)
                return false;
            return true;
        },
    },
    role: { type: Number, enum: common_1.SYS_ROLE, default: common_1.SYS_ROLE.user },
    provider: {
        type: Number,
        enum: common_1.SYS_PROVIDER,
        default: common_1.SYS_PROVIDER.system,
    },
    gender: { type: Number, enum: common_1.SYS_GENDER, default: common_1.SYS_GENDER.male },
}, { timestamps: true });
// // pre middleware // pre Hook
// schema.pre("updateOne", function () {
//   // logic of code for hashing password
// //1
//   console.log(this);
// }); // query middleware
// schema.pre("save", function () {
//   // logic of code for encrypted
//   //2
// });
// schema.pre("updateOne",{document:true, query:false}, function () {
//   // logic of code for hashing password
// //3
//   console.log(this); 
// }); // document middleware
exports.User = (0, mongoose_1.model)("User", schema);
//query return user
//user._id error >> IUser >> not have _id
//user.createdAt error >> IUser >> not have createdAt
//user.updateAt error >> IUser >> not have updateAt
//user.save()
//user._v
//user.deleteOne()
