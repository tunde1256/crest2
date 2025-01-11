"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary Cloud Name from .env
    api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API Key from .env
    api_secret: process.env.CLOUDINARY_API_SECRET // Cloudinary API Secret from .env
});
exports.default = cloudinary_1.v2;
