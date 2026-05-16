import express from 'express';
import * as userController from '../controllers/userController.js';
import * as tournamentController from '../controllers/tournamentController.js';
import * as matchController from '../controllers/matchController.js';
import * as aiController from '../controllers/aiController.js'; // The Text-to-SQL Brain
import * as leaderboardController from '../controllers/leaderboardController.js';
import * as achievementController from '../controllers/achievementController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// 1. AI-Native Onboarding Engine (Gatekeeper)
router.post('/auth/send-otp', authController.sendOTP);
router.post('/auth/verify-otp', authController.verifyOTP);
router.post('/auth/guest', authController.guestLogin);

// 2. Core User Identity
router.get('/user/:userId', userController.getUserProfile);
router.post('/user/:userId/gaming-id', userController.updateGamingId);

// 3. AI Strategic Matchmaking
router.get('/tournaments', tournamentController.getTournaments);
router.get('/tournaments/:id', tournamentController.getTournamentById);
router.post('/tournaments/:id/join', tournamentController.joinTournament);

// 4. Agentic Workflow (Match Tracking triggers Background AI)
router.post('/matches/track', matchController.trackMatch);
router.get('/user/:userId/matches', matchController.getPlayerMatches);

// 5. The "Brain" (Text-to-SQL Data OS) - UPGRADED FROM /ai-coach
// Frontend store ab is route par data bhejeta hai
router.post('/ai-insight', aiController.getAICoachAdvice); 

// 6. Predictive Scouting Engine
router.get('/leaderboard', leaderboardController.getLeaderboard);

// 7. Automated Achievement Tracking
router.get('/user/:userId/achievements', achievementController.getAchievements);
router.post('/achievements/progress', achievementController.updateAchievementProgress);

export default router;
