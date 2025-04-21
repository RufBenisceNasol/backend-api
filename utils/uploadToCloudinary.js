const cloudinary = require('./cloudinary'); // already configured

const uploadToCloudinary = (filePath, folder) => {
  return cloudinary.uploader.upload(filePath, { folder });
};

module.exports = uploadToCloudinary;