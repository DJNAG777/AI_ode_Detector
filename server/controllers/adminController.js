const User = require('../models/User');
const Report = require('../models/Report');

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReports = await Report.countDocuments();
    const aiReports = await Report.countDocuments({ aiScore: { $gte: 60 } });

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
    const recentReports = await Report.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'name email');

    const topLanguages = await Report.aggregate([
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const monthlyReports = await Report.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json({
      stats: { totalUsers, totalReports, aiReports, humanReports: totalReports - aiReports },
      recentUsers,
      recentReports,
      topLanguages,
      monthlyReports
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAdminStats, getAllUsers };
