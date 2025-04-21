const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary'); // This MUST be the instance, not a function

const storeImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'store-images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

const uploadStoreImage = multer({ storage: storeImageStorage });

module.exports = uploadStoreImage;
