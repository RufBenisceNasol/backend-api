const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload image to Cloudinary
const uploadToCloudinary = (filePath, folder) => {
  return cloudinary.uploader.upload(filePath, {
    folder: folder,
  });
};

module.exports = uploadToCloudinary;
