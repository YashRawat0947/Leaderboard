const express = require('express');
const { getUsers, addUser, claimPoints, getLeaderboard, getClaimHistory } = require('../controllers/userController');
const router = express.Router();

router.get('/users', getUsers);
router.post('/users', addUser);
router.post('/claim', claimPoints);
router.get('/leaderboard', getLeaderboard);
router.get('/history', getClaimHistory);

module.exports = router;
