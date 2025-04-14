const checkSeller = (req, res, next) => {
    if (!req.user || (req.user.role || '').toLowerCase() !== 'seller') {
      return res.status(403).json({ error: 'Access denied. Sellers only.' });
    }
    next();
  };
  
  module.exports = checkSeller;