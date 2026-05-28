const express = require('express');
const router = express.Router();
const { getUserReports, toggleFavorite, deleteReport, getUserStats } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.get('/user', protect, getUserReports);
router.get('/stats', protect, getUserStats);
router.patch('/:id/favorite', protect, toggleFavorite);
router.delete('/:id', protect, deleteReport);

module.exports = router;
