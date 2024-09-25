const Cloudinary = require("cloudinary").v2;
require("dotenv").config();
const fs = require("fs");

Cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImageFunction(localFilePath, folderName) {
  try {
    if (!localFilePath) return null;
    //upload
    const response = await Cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
}

module.exports = { uploadImageFunction };
