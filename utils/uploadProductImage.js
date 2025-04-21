const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary'); // This must be the Cloudinary instance

const productImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'product-images',  // Define the folder for product images
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

const uploadProductImage = multer({ storage: productImageStorage });

module.exports = uploadProductImage;
