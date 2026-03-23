import express from 'express';
import * as userController from '../controllers/userController.js';
import * as tournamentController from '../controllers/tournamentController.js';
import * as matchController from '../controllers/matchController.js';
import * as aiController from '../controllers/aiController.js';
import * as leaderboardController from '../controllers/leaderboardController.js';
import * as achievementController from '../controllers/achievementController.js';
import * as authController from '../controllers/authController.js';
const router = express.Router();

// User routes
router.get('/user/:userId', userController.getUserProfile);
router.post('/user/:userId/gaming-id', userController.updateGamingId);

// Tournament routes
router.get('/tournaments', tournamentController.getTournaments);
router.get('/tournaments/:id', tournamentController.getTournamentById);
router.post('/tournaments/:id/join', tournamentController.joinTournament);

// Match routes
router.post('/matches/track', matchController.trackMatch);
router.get('/user/:userId/matches', matchController.getPlayerMatches);

// AI routes
router.post('/ai-coach', aiController.getAICoachAdvice);

// Leaderboard routes
router.get('/leaderboard', leaderboardController.getLeaderboard);

// Achievement routes
router.get('/user/:userId/achievements', achievementController.getAchievements);
router.post('/achievements/progress', achievementController.updateAchievementProgress);


router.post('/auth/send-otp', authController.sendOTP);
router.post('/auth/verify-otp', authController.verifyOTP);
router.post('/auth/guest', authController.guestLogin);

export default router;
