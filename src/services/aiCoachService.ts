import { UserProfile, TrainingStats } from '../types';
import { TrainingModule, TrainingModuleType } from '../types/training';
import { trainingModuleRegistry } from '../registry/trainingModules';

export interface Recommendation {
  moduleId: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  score: number;
}

export const aiCoachService = {
  /**
   * Analyzes user performance and returns recommended training modules.
   */
  getRecommendations(user: UserProfile, stats: TrainingStats): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Logic for Aim Training
    if (stats.accuracy < 60) {
      recommendations.push({
        moduleId: TrainingModuleType.AIM_TRAINER,
        reason: 'Your accuracy is below 60%. Focus on precision drills.',
        priority: 'high',
        score: 95
      });
    }

    // Logic for Game Sense
    if (user.stats.avgPoints < 15) {
      recommendations.push({
        moduleId: TrainingModuleType.GAME_SENSE,
        reason: 'Your average points are low. Improve your situational awareness.',
        priority: 'medium',
        score: 80
      });
    }

    // Logic for Close Range
    if (user.stats.totalKills < 50) {
      recommendations.push({
        moduleId: TrainingModuleType.CLOSE_RANGE,
        reason: 'Master close-quarters combat to increase your kill count.',
        priority: 'medium',
        score: 75
      });
    }

    // Sort by score descending
    return recommendations.sort((a, b) => b.score - a.score);
  },

  /**
   * Gets the full module data for a recommendation.
   */
  getModuleData(moduleId: string): TrainingModule | null {
    const registryItem = trainingModuleRegistry[moduleId];
    if (!registryItem) return null;

    // Map registry item back to TrainingModule structure
    // In a real app, the registry might contain the full module data
    return {
      id: moduleId,
      title: registryItem.title,
      description: 'AI recommended drill based on your performance.',
      iconName: 'Target', // Default
      type: moduleId as TrainingModuleType,
      path: `/training/${moduleId}`,
      lessonCount: 1,
      color: 'text-primary',
      bg: 'bg-primary/20'
    };
  }
};
