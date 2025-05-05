const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

router.get('/private', verifyToken, (req, res) => {
  res.json({ msg: `Hello user ${req.user}, this is protected data.` });
});

module.exports = router;
