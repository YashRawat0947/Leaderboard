const User = require('../models/User');
const ClaimHistory = require('../models/ClaimHistory');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const user = new User({ name });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Error adding user' });
  }
};

exports.claimPoints = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const points = Math.floor(Math.random() * 10) + 1;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.totalPoints += points;
    await user.save();

    const claimHistory = new ClaimHistory({ userId, pointsAwarded: points });
    await claimHistory.save();

    res.json({ points, user });
  } catch (error) {
    console.error('Error claiming points:', error);
    res.status(500).json({ message: 'Error claiming points' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};

exports.getClaimHistory = async (req, res) => {
  try {
    const history = await ClaimHistory.find().populate('userId');
    res.json(history);
  } catch (error) {
    console.error('Error fetching claim history:', error);
    res.status(500).json({ message: 'Error fetching claim history' });
  }
};