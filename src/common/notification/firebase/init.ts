import {FirebasePushNotificationProvider} from "./firebase.service";
import * as fs from "node:fs";
import path from "node:path";

const config =
    JSON.parse(
        fs.readFileSync(
            path.resolve("./src/config/social-app-ffc6f-firebase-adminsdk-fbsvc-22c26e8ca6.json")
        ) as unknown as string
    )
export const firebasePushNotificationProvider = new FirebasePushNotificationProvider(config);