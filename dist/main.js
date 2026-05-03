"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_controller_1 = require("./app.controller");
(0, app_controller_1.bootstrap)();
// const user = new User({
//   userName: "mahmoud",
//   email: `${Math.random()}@g.com`,
//   password: "12345",
// });
// user.save(); //doc method
// User.update(
// {_id: "69f7239aed0e05eeda655e71"},
//   {userName:"mahmoudupdate"}
// }); //query method
// mongoose middleware 
// 2 type >> pre >> post
// logic of code execution before or after db method
//  pre
// save >> phoneNumber>> encrypt
// save >> password >> hash 
//post
// save >> send otp
// middleware 4 types
// document
// query
// model
// aggregation
