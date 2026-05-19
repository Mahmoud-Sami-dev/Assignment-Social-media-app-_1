import multer, {memoryStorage} from "multer";

//todo : why to use diskStorage insteadof memoryStorage
export function multerUploadFile() {
    return multer({storage: memoryStorage()})
}