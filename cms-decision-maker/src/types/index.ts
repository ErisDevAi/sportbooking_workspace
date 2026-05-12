export type { User } from './user';
export type { Category } from './category';
export type { WheelContent } from './wheel-contents';
export type { SpinHistory, Streak, SpinStats } from './spin-histories';
export type { Backup } from './backup';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
