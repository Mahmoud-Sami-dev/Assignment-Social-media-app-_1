// main function run the app
import express, {NextFunction, Request, Response} from "express";
import {authRouter, commentRouter, postRouter, requestRouter} from "./modules";
import {BadRequestException, NotFoundException} from "./common";
import {connectDB} from "./DB/connection";
import {redisConnect} from "./DB/redis.connect";
import {s3CloudProvider} from "./common/cloud/s3/init";
import {pipeline} from "node:stream";
import {promisify} from "node:util";
import cors from "cors";
import {firebasePushNotificationProvider} from "./common/notification/firebase/init";

const pipelinePromise = promisify(pipeline)

export function bootstrap() {
    const app = express();
    const port = 3000;
    // to get files
    // url >> http://127.0.0.1:3000/uploads/social-app/users/12345/profile-pic/mamoud.jpg
    app.get("/uploads/*paths", async (req: Request, res: Response, next: NextFunction) => {
        console.log("params", req.params.paths);
        let key = (req.params.paths as string[]).join('/')
        console.log("merged params", key)
        const fileExist = await s3CloudProvider.getFile(key);
        if (!fileExist) {
            throw new NotFoundException("File not found");
        }
        // res >> write stream
        // fileExist >> read stream
        // backpressure >> pipe
        // fileExist.pipe(res);
        await pipelinePromise(fileExist, res);
    })
    connectDB();
    redisConnect();
    app.use(express.json());
    app.use(cors({origin: "*"}));

    // test for notification
    app.post('/send-notification', async (req: Request, res: Response): Promise<void> => {
        let fcmToken: any = req.body.token;

        await firebasePushNotificationProvider.send(fcmToken, {
            body: `welcome to firebase push notification you receive this notification at ${new Date()}`,
            title: "firebase notification"
        });

        res.sendStatus(204);
    });
    //routing
    app.use("/auth", authRouter);
    app.use("/post", postRouter);
    app.use("/comment", commentRouter);
    app.use("/request", requestRouter);
    // global error handler
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        return res.status((error.cause as number) || 500).json({
            message: error.message,
            success: false,
            details: error instanceof BadRequestException ? error.details : undefined,
        });
    });

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}
