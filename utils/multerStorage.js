const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('./cloudinary'); // ✅ import the configured instance

const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // ✅ required!
  params: {
    folder: 'products', // optional folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const upload = multer({ storage });

module.exports = upload;