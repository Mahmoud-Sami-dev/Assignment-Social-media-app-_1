import {NextFunction, Request, Response, Router} from "express";
import {multerUploadFile} from "../../common";
import userService from "./user.service";
import {Types} from "mongoose";

const router = Router();

//upload profile pic
router.post('/profile-pic',
    // todo: auth
    // multer >> file >> originalName , mimetype
    multerUploadFile().single('profile-pic'),
    async (req: Request, res: Response, next: NextFunction) => {
        const data = await userService.uploadProfilePic(req.file as Express.Multer.File,
            new Types.ObjectId('69ec9daafc88cd3b49827d8d'))
        return res.status(200).json({message: "Success", data})
    }
)
export default router;