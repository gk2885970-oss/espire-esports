import React from 'react';
import AimTrainerGame from '../pages/training/AimTrainerGame';
import CloseRangeTracking from '../pages/training/CloseRangeTracking';
import ZonePrediction from '../pages/training/ZonePrediction';
import UtilityMasterclass from '../pages/training/UtilityMasterclass';
import AimTraining from '../pages/training/AimTraining';
import GameSense from '../pages/training/GameSense';
import Strategy from '../pages/training/Strategy';
import Teamwork from '../pages/training/Teamwork';
import LiveCoaching from '../pages/LiveCoaching';
import Performance from '../pages/Performance';
import { TrainingModuleType } from '../types/training';

export interface ModuleRegistryItem {
  component: React.ComponentType<any>;
  title: string;
}

export const trainingModuleRegistry: Record<string, ModuleRegistryItem> = {
  [TrainingModuleType.AIM_TRAINER]: {
    component: AimTrainerGame,
    title: 'Aim Trainer'
  },
  [TrainingModuleType.CLOSE_RANGE]: {
    component: CloseRangeTracking,
    title: 'Close Range Tracking'
  },
  [TrainingModuleType.ZONE_PREDICTION]: {
    component: ZonePrediction,
    title: 'Zone Prediction'
  },
  [TrainingModuleType.UTILITY_MASTER]: {
    component: UtilityMasterclass,
    title: 'Utility Masterclass'
  },
  [TrainingModuleType.GAME_SENSE]: {
    component: GameSense,
    title: 'Game Sense'
  },
  [TrainingModuleType.STRATEGY]: {
    component: Strategy,
    title: 'Strategy'
  },
  [TrainingModuleType.TEAMWORK]: {
    component: Teamwork,
    title: 'Teamwork'
  },
  [TrainingModuleType.LIVE_COACHING]: {
    component: LiveCoaching,
    title: 'Live Coaching'
  },
  [TrainingModuleType.ANALYTICS]: {
    component: Performance,
    title: 'Player Analytics'
  },
  // Legacy aliases
  'aim': {
    component: AimTraining,
    title: 'Aim Training'
  }
};
