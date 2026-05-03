import { model, Schema } from "mongoose";
import { IUser, SYS_GENDER, SYS_PROVIDER, SYS_ROLE } from "../../../common";

const schema = new Schema<IUser>(
  {
    userName: { type: String, required: true, minLength: 2, maxLength: 30 },
    email: { type: String, required: true },
    phoneNumber: { type: String },
    password: {
      type: String,
      required: function () {
        if (this.provider == SYS_PROVIDER.google) return false;
        return true;
      },
    },
    role: { type: Number, enum: SYS_ROLE, default: SYS_ROLE.user },
    provider: {
      type: Number,
      enum: SYS_PROVIDER,
      default: SYS_PROVIDER.system,
    },
    gender: { type: Number, enum: SYS_GENDER, default: SYS_GENDER.male },
  },
  { timestamps: true },
);

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


export const User = model<IUser>("User", schema);


//query return user
//user._id error >> IUser >> not have _id
//user.createdAt error >> IUser >> not have createdAt
//user.updateAt error >> IUser >> not have updateAt

//user.save()
//user._v
//user.deleteOne()