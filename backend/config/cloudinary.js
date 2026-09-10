const cloudinary = require("cloudinary").v2;
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
};

cloudinary.config(cloudinaryConfig);

const isCloudinaryConfigured = Object.values(cloudinaryConfig).every(
    (value) => Boolean(value)
);

module.exports = cloudinary;
module.exports.isCloudinaryConfigured = isCloudinaryConfigured;