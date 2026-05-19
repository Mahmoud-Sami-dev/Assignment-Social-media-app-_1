import type {NextFunction, Request, Response} from "express";
import {Router} from "express";
import requestService from "./request.service";
import {Types} from "mongoose";


const router = Router();

router.post("/:receiverId",
    //todo >> auth
    async (req: Request, res: Response, next: NextFunction) => {
        //call service
        await requestService.sendRequest(
            new Types.ObjectId("69ec9daafc88cd3b49827d8d"),
            new Types.ObjectId(req.params.receiverId as string),
        )

        // send response ['done']
        return res.sendStatus(204);
    }
)

router.post("/accept/:id",
    //todo >> auth
    async (req: Request, res: Response, next: NextFunction) => {
        await requestService.acceptRequest(
            new Types.ObjectId("69f746ec226285fbd461f3bb"),
            new Types.ObjectId(req.params.id as string),
        );
        return res.sendStatus(204);
    }
)

router.delete("/decline/:id",
    //todo >> auth
    async (req: Request, res: Response, next: NextFunction) => {
        await requestService.declineRequest2(
            new Types.ObjectId("69f746ec226285fbd461f3bb"),
            new Types.ObjectId(req.params.id as string),
        );
        return res.sendStatus(204);
    }
)

router.delete("/remove/:friendId",
    //todo >> auth
    async (req: Request, res: Response, next: NextFunction) => {
        await requestService.removeFriend(
            new Types.ObjectId("69f746ec226285fbd461f3bb"),
            new Types.ObjectId(req.params.friendId as string),
        );
        return res.sendStatus(204);
    }
)

export default router;


