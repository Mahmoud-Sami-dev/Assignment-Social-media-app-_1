"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// nestjs >>> dependency injection ==> design pattern
const common_1 = require("../../common");
const user_repository_1 = require("../../DB/models/user/user.repository");
const redis_service_1 = require("../../DB/redis.service");
// singleton pattern ==> only one instance of a class is created and shared across the application
class AuthService {
    userRepository = new user_repository_1.UserRepository();
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async signup(signupDTO) {
        const { email } = signupDTO;
        // check if user already exists
        const userExist = await this.userRepository.getOne({ email }, {}, {});
        if (userExist)
            throw new common_1.ConflictException("user already exists");
        // hash password ✔
        signupDTO.password = await (0, common_1.hash)(signupDTO.password);
        // encryption phone number ✔
        if (signupDTO.phoneNumber)
            signupDTO.phoneNumber = (0, common_1.encryption)(signupDTO.phoneNumber);
        // send OTP
        const otp = (0, common_1.generateOTP)();
        // send email
        await (0, common_1.sendMail)({
            to: signupDTO.email,
            subject: "confirm email",
            html: `<p> otp to verify account is ${otp}</p>`,
        });
        //save otp into cache ttl
        await (0, redis_service_1.setIntoCache)(`${signupDTO.email}:otp`, otp, 3 * 60);
        // create user into redis
        await (0, redis_service_1.setIntoCache)(signupDTO.email, JSON.stringify(signupDTO), 3 * 24 * 60 * 60);
    }
    async verifyAccount(verifyAccountDTO) {
        // get user data from cache >> null >> fail
        const userData = await (0, redis_service_1.getFromCache)(verifyAccountDTO.email);
        if (!userData)
            throw new common_1.NotFoundException("user not found");
        // verify otp
        const otp = await (0, redis_service_1.getFromCache)(`${verifyAccountDTO.email}:otp`);
        if (!otp)
            throw new common_1.BadRequestException("expire otp");
        if (otp != verifyAccountDTO.otp)
            throw new common_1.BadRequestException("invalid otp");
        //convert to real user
        this.userRepository.create(JSON.parse(userData));
        // delete otp
        await (0, redis_service_1.deleteFromCache)(`${verifyAccountDTO.email}:otp`);
        await (0, redis_service_1.deleteFromCache)(`${verifyAccountDTO.email}`);
    }
    // forget password
    async sendOTP(sendOtpDTO) {
        // check email existence into DB
        const userExistIntoDB = await this.userRepository.getOne({
            email: sendOtpDTO.email,
        }, {}, // projection
        {});
        //check email existence into cache
        const userExistIntoCache = await (0, redis_service_1.getFromCache)(sendOtpDTO.email);
        if (!userExistIntoCache && !userExistIntoDB) {
            throw new common_1.NotFoundException("user not found, please signup");
        }
        // check already has a valid OTP
        const otpExist = await (0, redis_service_1.getFromCache)(`${sendOtpDTO.email}:otp`);
        if (otpExist) {
            throw new common_1.BadRequestException(" already have a valid otp");
        }
        // generate new otp
        const otp = (0, common_1.generateOTP)();
        (0, common_1.sendMail)({
            to: sendOtpDTO.email,
            subject: "re-send otp",
            html: `<p> your otp is ${otp}</p>`,
        });
        (0, redis_service_1.setIntoCache)(`${sendOtpDTO.email}:otp`, otp, 3 * 60);
    }
    async resetPassword(resetPasswordDTO) {
        // check email valid
        const userExist = await this.userRepository.getOne({
            email: resetPasswordDTO.email,
        }, {}, {});
        if (!userExist) {
            throw new common_1.NotFoundException("user not found");
        }
        // check otp valid
        const otp = await (0, redis_service_1.getFromCache)(`${resetPasswordDTO.email}:otp`);
        if (otp != resetPasswordDTO.otp) {
            throw new common_1.BadRequestException("invalid otp");
        }
        // hash password
        resetPasswordDTO.newPassword = await (0, common_1.hash)(resetPasswordDTO.newPassword);
        // update password
        await this.userRepository.updateOne({ email: resetPasswordDTO.email }, { password: resetPasswordDTO.newPassword });
    }
    async login(loginDTO) {
        // check user exists
        const userExist = await this.userRepository.getOne({ email: loginDTO.email }, {}, {});
        if (!userExist)
            throw new common_1.NotFoundException("invalid email or password");
        // compare password
        const isMatch = await (0, common_1.compare)(loginDTO.password, userExist.password);
        if (!isMatch)
            throw new common_1.NotFoundException("invalid email or password");
    }
    async changePassword(changePasswordDTO) {
        // get user
        const user = await this.userRepository.getOne({ email: changePasswordDTO.email }, {}, {});
        if (!user)
            throw new common_1.NotFoundException("user not found");
        // verify old password
        const isMatch = await (0, common_1.compare)(changePasswordDTO.oldPassword, user.password);
        if (!isMatch)
            throw new common_1.BadRequestException("old password is incorrect");
        // hash new password
        const hashedPassword = await (0, common_1.hash)(changePasswordDTO.newPassword);
        // update password
        await this.userRepository.updateOne({ email: changePasswordDTO.email }, { password: hashedPassword });
    }
}
exports.default = new AuthService();
// authentication
// >> signup >> verifyAccount >> login >> sent otp >> forgetPassword
