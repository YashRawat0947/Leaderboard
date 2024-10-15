const User = require('../models/User');
const ClaimHistory = require('../models/ClaimHistory');

exports.getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

exports.addUser = async (req, res) => {
  const { name } = req.body;
  const user = new User({ name });
  await user.save();
  res.json(user);
};

// Claim points for a user
exports.claimPoints = async (req, res) => {
  const { userId } = req.body;
  const points = Math.floor(Math.random() * 10) + 1;

  // Update user's total points
  const user = await User.findById(userId);
  user.totalPoints += points;
  await user.save();

  // Claim in history
  const claimHistory = new ClaimHistory({ userId, pointsAwarded: points });
  await claimHistory.save();

  res.json({ points, user });
};

exports.getLeaderboard = async (req, res) => {
  const users = await User.find().sort({ totalPoints: -1 });
  res.json(users);
};

exports.getClaimHistory = async (req, res) => {
  const history = await ClaimHistory.find().populate('userId');
  res.json(history);
};
