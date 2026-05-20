import {ICloudProvider} from "../cloud.interface";
import {DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {S3_BUCKET_NAME} from "../../../config";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

interface S3Config {
    region: string;
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
    }
}

class S3CloudProvider implements ICloudProvider {
    private readonly client: S3Client;

    constructor(config: S3Config) {
        this.client = new S3Client({
            region: config.region,
            credentials: config.credentials
        });
    }

    async deleteFile(key: string): Promise<boolean | undefined> {
        let command = new DeleteObjectCommand({
            Key: key,
            Bucket: S3_BUCKET_NAME,
        });
        const {DeleteMarker} = await this.client.send(command)
        return DeleteMarker as boolean;
    }

    async getFile(key: string): Promise<NodeJS.ReadableStream | undefined> {
        let command = new GetObjectCommand({
            Key: key,
            Bucket: S3_BUCKET_NAME,
        })
        const {Body} = await this.client.send(command)
        return Body as NodeJS.ReadableStream;
    }

    // handle files >>
    // 1.busboy for parsing files
    // 2. multer for upload file into storage [hard disk, (ram) memory]
    async uploadFile(file: Express.Multer.File, path: string): Promise<{ url: string, key: string }> {
        let command = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: `social-app/${path}/${Date.now()}_${file.originalname}`, // folder ex:'social-app/users/12345/posts/12345678/imagename
            ACL: "public-read",
            ContentType: file.mimetype, //"application/pdf"
            // Body: file.buffer  // hint >> file.buffer
        });
        await this.client.send(command);
        //@ts-expect-error
        // {url, Key}
        const url = await getSignedUrl(this.client, command, {expiresIn: 1800})
        return {url, key: command.input.Key as string};

    }
}

export default S3CloudProvider;
//command for S3 cloud service
// app- integration >> todo: apiKey , apiSecret