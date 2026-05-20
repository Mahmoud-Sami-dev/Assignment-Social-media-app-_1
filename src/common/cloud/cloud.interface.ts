// file >> multer [busboy] >> file information >> {filename?, destination?,original,mimetype,encoding,buffer?}
export interface ICloudProvider {
    // aws >> S3 >> return Key >> string >> path of file >> 'soical-app/users/12345/profilePic/mahmoud.jpg'
    //not return url , return Path
    uploadFile(file: Express.Multer.File, path: string): Promise<{ url: string, key: string }>; // key

    deleteFile(key: string): Promise<boolean | undefined>;

    getFile(key: string): Promise<NodeJS.ReadableStream | undefined>;
}