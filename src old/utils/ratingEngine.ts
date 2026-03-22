import { UserProfile } from '../types';

export const calculateAIRating = (stats: UserProfile['stats']) => {
  const { totalPoints, totalKills, booyahs, top3, avgPoints } = stats;
  
  // Formula: (totalPoints * 0.4) + (totalKills * 0.2) + (booyahs * 5) + (top3 * 2) + (avgPoints * 10)
  let rating = (totalPoints * 0.4) + (totalKills * 0.2) + (booyahs * 5) + (top3 * 2) + (avgPoints * 10);
  
  // Normalize/Cap at 100
  rating = Math.min(100, Math.max(0, rating));
  
  return Math.round(rating);
};

export const getAIRank = (rating: number): string => {
  if (rating <= 20) return 'Bronze';
  if (rating <= 40) return 'Silver';
  if (rating <= 60) return 'Gold';
  if (rating <= 80) return 'Diamond';
  return 'Elite Pro';
};

export const getRatingSuggestion = (stats: UserProfile['stats']): string => {
  const { totalPoints, totalKills, booyahs, top3, avgPoints } = stats;
  
  if (totalKills < totalPoints * 0.2) return "Focus on increasing your kill count to boost your rating.";
  if (booyahs < 1) return "Securing a Booyah will significantly increase your AI rating.";
  if (top3 < 3) return "Consistency is key. Aim for more Top 3 finishes.";
  if (avgPoints < 15) return "Improve your average points per match to climb the ranks.";
  
  return "You're performing well! Keep up the consistency to reach Elite Pro.";
};
