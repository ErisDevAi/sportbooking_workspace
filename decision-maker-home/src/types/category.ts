export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description?: string;
  isDefault: boolean;
  isPublic: boolean;
  createdBy: string;
  choiceCount?: number;
  createdAt: string;
  updatedAt: string;
}