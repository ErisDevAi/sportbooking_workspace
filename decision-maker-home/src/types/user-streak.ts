export interface Badge {
  slug: string;
  name: string;
  icon: string;
  earnedAt: string;
}

export interface UserStreak {
  _id: string;
  userId: { _id: string; name: string; email: string } | string;
  currentStreak: number;
  longestStreak: number;
  totalDecisions: number;
  totalCheckins: number;
  lastCheckinDate: string;
  streakStartDate: string;
  level: number;
  badges: Badge[];
  createdAt: string;
  updatedAt: string;
}
