export enum TrainingModuleType {
  AIM_TRAINER = 'aim-trainer',
  CLOSE_RANGE = 'close-range',
  ZONE_PREDICTION = 'zone-prediction',
  UTILITY_MASTER = 'utility-master',
  GAME_SENSE = 'game-sense',
  STRATEGY = 'strategy',
  TEAMWORK = 'teamwork',
  LIVE_COACHING = 'live-coaching',
  ANALYTICS = 'analytics'
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  iconName: string; // We'll map this to Lucide icons
  type: TrainingModuleType;
  path: string;
  lessonCount: number;
  color: string;
  bg: string;
}
