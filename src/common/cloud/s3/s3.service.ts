import {ICloudProvider} from "../cloud.interface";
import {DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {S3_BUCKET_NAME} from "../../../config";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {Upload} from "@aws-sdk/lib-storage";

// lib storage support large files

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

    async deleteFile(key: string): Promise<void> {
        let command = new DeleteObjectCommand({
            Key: key,
            Bucket: S3_BUCKET_NAME,
        });
        const {DeleteMarker} = await this.client.send(command)
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
    // support files up to 5 GB
    async uploadFileV1(file: Express.Multer.File, path: string): Promise<string> {
        let command = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: `social-app/${path}/${Date.now()}_${file.originalname}`, // folder ex:'social-app/users/12345/posts/12345678/imagename
            ACL: "public-read",
            ContentType: file.mimetype, //"application/pdf"
            // Body: file.buffer  // hint >> file.buffer
        });
        await this.client.send(command);
        // {url, Key}
        // const url = await getSignedUrl(this.client, command, {expiresIn: 5 * 60})
        // return {url, key: command.input.Key as string};
        return command.input.Key as string;
    }

    async uploadFileV2(file: Express.Multer.File, path: string): Promise<string> {
        let command = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: `social-app/${path}/${Date.now()}_${file.originalname}`, // folder ex:'social-app/users/12345/posts/12345678/imagename
            ACL: "public-read",
            ContentType: file.mimetype, //"application/pdf"
            // Body: file.buffer  // hint >> file.buffer
        });
        return await getSignedUrl(this.client, command, {expiresIn: Date.now()});
    }

    async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
        const upload = new Upload({
            client: this.client,
            params: {
                Bucket: S3_BUCKET_NAME,
                Key: `social-app/${path}/${Date.now()}_${file.originalname}`, // folder ex:'social-app/users/12345/posts/12345678/imagename
                ACL: "public-read",
                ContentType: file.mimetype, //"application/pdf"
                Body: file.buffer
            }
        });
        // emit >> chunk of file >> emit httpUploadProgress >> {loaded , total , }
        upload.on("httpUploadProgress", (progress) => {
            console.log(progress); // todo: emit FE [realtime app] 10% >> 20%
        })
        const {Key} = await upload.done()
        return Key as string;
    }

}

export default S3CloudProvider;
//command for S3 cloud service
// app- integration >> todo: apiKey , apiSecret


