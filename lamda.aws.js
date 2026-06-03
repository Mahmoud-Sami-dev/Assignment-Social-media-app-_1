// Implementation
const {MongoClient, ObjectId} = require("mongodb");

const MONGO_URI = "mongodb://127.0.0.1:27017/social-app";
const DB_NAME = "social-app";

let client;

const connectDB = async () => {
    if (!client) {
        client = new MongoClient(MONGO_URI);
        await client.connect();
    }
    return client;
};
// lamda function
const handler = async (event) => {
    const client = await connectDB();
    const db = client.db(DB_NAME);
    const users = db.collection("users");

    for (const record of event.Records) {
        try {
            let fullKey = decodeURIComponent(
                record.s3.object.key.replace(/\+/g, " ")
            );

            console.log("S3 key:", fullKey);

            const parts = fullKey.split("/");
            const userId = parts[2];

            const result = await users.updateOne(
                {_id: new ObjectId(userId)},
                {
                    $set: {
                        profilePic: fullKey,
                        updatedAt: new Date(),
                    },
                }
            );

            console.log("Updated user:", result.modifiedCount);
        } catch (error) {
            console.error("Lambda error for record:", error);
        }
    }

    return {statusCode: 200};
};

handler({
    Records: [{
        s3: {
            object: {
                key: "social-app/users/69ec9daafc88cd3b49827d8d/WhatsApp Image 2026-05-20 at 1.48.50 PM.jpeg"
            }
        }
    }]
}).then(() => process.exit(0));

module.exports = {handler};


// lamda function
//S3 >> run successfully
// export const handler = async (event) => {
//
//     for (const record of event.Records) {
//         try {
//
//
//
//         } catch (error) {
//             console.error("Lambda error for record:", error);
//         }
//     }
//
//     return {statusCode: 200};
// };