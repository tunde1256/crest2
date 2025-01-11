import multer from 'multer';
import cloudinaryV2 from './cloudinaryConfig';
import multerStorageCloudinary from 'multer-storage-cloudinary';
import { Request, Response } from 'express';

const storage = multerStorageCloudinary({
  cloudinary: cloudinaryV2,
});

const upload = multer({
  storage: storage,
  fileFilter: (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;
