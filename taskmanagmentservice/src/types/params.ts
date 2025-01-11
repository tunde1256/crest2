// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import { v2 as cloudinary } from 'cloudinary';

// // Ensure Cloudinary is correctly configured
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
//   api_key: process.env.CLOUDINARY_API_KEY as string,
//   api_secret: process.env.CLOUDINARY_API_SECRET as string,
// });

// // Create a custom storage using Cloudinary
// interface MulterFile extends Express.Multer.File {
//   originalname: string;
// }

// // Extend the Params type to include 'folder'
// interface ExtendedParams {
//   public_id: (req: Express.Request, file: MulterFile) => string;
//   folder: string;
//   allowed_formats: string[];
//   resource_type: string;
// }

// const storage = new CloudinaryStorage({
//   cloudinary,  // Pass Cloudinary directly
//   params: {
//     public_id: (req: Express.Request, file: MulterFile) => `taskmanagmentservice/${file.originalname}`,  // Public ID for Cloudinary
//     folder: 'taskmanagmentservice',  // Set the folder name for Cloudinary
//     allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'pdf'],  // Allowed formats
//     resource_type: 'auto',  // Automatically detect the file type
//   } as ExtendedParams, // Cast to the extended type to allow 'folder'
// });

// // Initialize multer with Cloudinary storage
// const upload = multer({ storage });

// export default upload;
