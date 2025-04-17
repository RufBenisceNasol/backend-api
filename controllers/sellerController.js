// controllers/sellerController.js

// Fetch authenticated seller's profile
const getSellerProfile = async (req, res) => {
  try {
    const user = req.user; // Populated by authenticate middleware

    if (!user || user.role !== 'Seller') {
      return res.status(403).json({ message: 'Access denied. Sellers only.' });
    }

    res.status(200).json({
      message: 'Seller profile fetched successfully',
      seller: {
        id: user._id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        store: user.store || null,
      },
    });
  } catch (error) {
    console.error('Error fetching seller profile:', error.message);
    res.status(500).json({
      error: 'Failed to fetch seller profile',
      details: error.message,
    });
  }
};

// ✅ Always export an object with named functions
exports.getSellerProfile = getSellerProfile;
