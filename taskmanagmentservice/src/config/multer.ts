import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { IncomingMessage } from 'http';
interface MulterFile extends Express.Multer.File {}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

const customStorageEngine = multer.diskStorage({
  destination: (req: IncomingMessage, file: MulterFile, callback: Function) => {
    callback(null, 'temp');
  },
  filename: (req: IncomingMessage, file: MulterFile, callback: Function) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: customStorageEngine });

export default upload;
