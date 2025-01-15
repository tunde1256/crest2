"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const cloudinaryConfig_1 = __importDefault(require("./cloudinaryConfig"));
const multer_storage_cloudinary_1 = __importDefault(require("multer-storage-cloudinary"));
const storage = (0, multer_storage_cloudinary_1.default)({
    cloudinary: cloudinaryConfig_1.default,
});
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});
exports.default = upload;
