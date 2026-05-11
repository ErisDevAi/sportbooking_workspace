export interface SpinHistory {
  _id: string;
  userId: string;
  categoryId: string;
  selectedContentId: string;
  selectedLabel: string;
  currentStreak: number;
  maxStreak: number;
  lastSpinAt: string;
  isVerified: boolean;
  verifiedAt?: string;
  rating?: number;
  reviewNote?: string;
  createdAt: string;
}

export interface Streak {
  categoryId: { _id: string; name: string; icon: string };
  currentStreak: number;
  maxStreak: number;
  totalSpins: number;
  lastSpinDate: string;
}

export interface SpinStats {
  _id: string;
  label: string;
  count: number;
}