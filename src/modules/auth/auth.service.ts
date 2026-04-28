// nestjs >>> dependency injection ==> design pattern
import {
  BadRequestException,
  compare,
  ConflictException,
  encryption,
  generateOTP,
  hash,
  NotFoundException,
  sendMail,
} from "../../common";
import { UserRepository } from "../../DB/models/user/user.repository";
import {
  deleteFromCache,
  getFromCache,
  setIntoCache,
} from "../../DB/redis.service";
import {
  ChangePasswordDTO,
  LoginDTO,
  ResetPasswordDTO,
  SendOtpDTO,
  SignupDTO,
  VerifyAccountDTO,
} from "./auth.dto";

// singleton pattern ==> only one instance of a class is created and shared across the application
class AuthService {
  private userRepository = new UserRepository();
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signup(signupDTO: SignupDTO) {
    const { email } = signupDTO;
    // check if user already exists
    const userExist = await this.userRepository.getOne({ email }, {}, {});
    if (userExist) throw new ConflictException("user already exists");
    // hash password ✔
    signupDTO.password = await hash(signupDTO.password);
    // encryption phone number ✔
    if (signupDTO.phoneNumber)
      signupDTO.phoneNumber = encryption(signupDTO.phoneNumber);
    // send OTP
    const otp = generateOTP();
    // send email
    await sendMail({
      to: signupDTO.email,
      subject: "confirm email",
      html: `<p> otp to verify account is ${otp}</p>`,
    });
    //save otp into cache ttl
    await setIntoCache(`${signupDTO.email}:otp`, otp, 3 * 60);
    // create user into redis
    await setIntoCache(
      signupDTO.email,
      JSON.stringify(signupDTO),
      3 * 24 * 60 * 60,
    );
  }
  async verifyAccount(verifyAccountDTO: VerifyAccountDTO) {
    // get user data from cache >> null >> fail
    const userData = await getFromCache(verifyAccountDTO.email);
    if (!userData) throw new NotFoundException("user not found");
    // verify otp
    const otp = await getFromCache(`${verifyAccountDTO.email}:otp`);
    if (!otp) throw new BadRequestException("expire otp");
    if (otp != verifyAccountDTO.otp)
      throw new BadRequestException("invalid otp");
    //convert to real user
    this.userRepository.create(JSON.parse(userData));
    // delete otp
    await deleteFromCache(`${verifyAccountDTO.email}:otp`);
    await deleteFromCache(`${verifyAccountDTO.email}`);
  }
  // forget password
  async sendOTP(sendOtpDTO: SendOtpDTO) {
    // check email existence into DB
    const userExistIntoDB = await this.userRepository.getOne(
      {
        email: sendOtpDTO.email,
      },
      {}, // projection
      {}, // populate
    );
    //check email existence into cache
    const userExistIntoCache = await getFromCache(sendOtpDTO.email);
    if (!userExistIntoCache && !userExistIntoDB) {
      throw new NotFoundException("user not found, please signup");
    }
    // check already has a valid OTP
    const otpExist = await getFromCache(`${sendOtpDTO.email}:otp`);
    if (otpExist) {
      throw new BadRequestException(" already have a valid otp");
    }
    // generate new otp
    const otp = generateOTP();
    sendMail({
      to: sendOtpDTO.email,
      subject: "re-send otp",
      html: `<p> your otp is ${otp}</p>`,
    });
    setIntoCache(`${sendOtpDTO.email}:otp`, otp, 3 * 60);
  }
  async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
    // check email valid
    const userExist = await this.userRepository.getOne(
      {
        email: resetPasswordDTO.email,
      },
      {},
      {},
    );
    if (!userExist) {
      throw new NotFoundException("user not found");
    }
    // check otp valid
    const otp = await getFromCache(`${resetPasswordDTO.email}:otp`);
    if (otp != resetPasswordDTO.otp) {
      throw new BadRequestException("invalid otp");
    }
    // hash password
    resetPasswordDTO.newPassword = await hash(resetPasswordDTO.newPassword);
    // update password
    await this.userRepository.updateOne(
      { email: resetPasswordDTO.email },
      { password: resetPasswordDTO.newPassword },
    );
  }
  async login(loginDTO: LoginDTO) {
    // check user exists
    const userExist = await this.userRepository.getOne(
      { email: loginDTO.email },
      {},
      {},
    );
    if (!userExist) throw new NotFoundException("invalid email or password");
    // compare password
    const isMatch = await compare(loginDTO.password, userExist.password);
    if (!isMatch) throw new NotFoundException("invalid email or password");
  }
  async changePassword(changePasswordDTO: ChangePasswordDTO) {
    // get user
    const user = await this.userRepository.getOne(
      { email: changePasswordDTO.email },
      {},
      {},
    );
    if (!user) throw new NotFoundException("user not found");
    // verify old password
    const isMatch = await compare(changePasswordDTO.oldPassword, user.password);
    if (!isMatch) throw new BadRequestException("old password is incorrect");
    // hash new password
    const hashedPassword = await hash(changePasswordDTO.newPassword);
    // update password
    await this.userRepository.updateOne(
      { email: changePasswordDTO.email },
      { password: hashedPassword },
    );
  }
}

export default new AuthService();

// authentication
// >> signup >> verifyAccount >> login >> sent otp >> forgetPassword
