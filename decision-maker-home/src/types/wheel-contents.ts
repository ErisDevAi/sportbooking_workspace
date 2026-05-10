export interface WheelContent {
  _id: string;
  label: string;
  description?: string;
  image?: string;
  color: string;
  weight: number;
  categoryId: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}