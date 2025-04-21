const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    storeName: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // One store per seller
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    image: {
        type: String,
        default: 'https://res.cloudinary.com/dflcnd7z3/image/upload/v1743873916/store-images/defaultStore.png'
    }
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
