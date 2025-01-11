"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const cloudinaryConfig_1 = __importDefault(require("./cloudinaryConfig")); // Import Cloudinary configuration
const multer_storage_cloudinary_1 = __importDefault(require("multer-storage-cloudinary"));
// Set up multer storage for Cloudinary
const storage = (0, multer_storage_cloudinary_1.default)({
    cloudinary: cloudinaryConfig_1.default,
});
// Set up multer for handling image upload
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']; // Allowed file types
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        }
        else {
            cb(new Error('Only image files are allowed!'), false); // Reject non-image files
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});
exports.default = upload;
