const cloudinary = require('./utils/cloudinary'); // or wherever your cloudinary.js is
const path = require('path');

(async () => {
  try {
    console.log('🚀 Uploading test image...');

    const result = await cloudinary.uploader.upload(
      'C:/Users/USER/Desktop/test.jpg', // ✅ use full path with forward slashes
      { folder: 'products' }
    );

    console.log('✅ Upload successful!');
    console.log('🌐 URL:', result.secure_url);
  } catch (error) {
    console.error('❌ Cloudinary Upload Error:', error);
  }
})();
