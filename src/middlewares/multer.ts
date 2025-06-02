import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}

interface MulterCallback {
    (error: Error | null, destinationOrFilename: string): void;
}

const storage: multer.StorageEngine = multer.diskStorage({
    destination: (req: Express.Request, file: MulterFile, cb: MulterCallback) => {
        cb(null, uploadDir);
    },
    filename: (req: Express.Request, file: MulterFile, cb: MulterCallback) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

export default upload;