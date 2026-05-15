export interface WheelContentLocation {
  lat?: number;
  lng?: number;
  address?: string;
}

export interface WheelContentMetadata {
  priceRange?: number;
  rating?: number;
  url?: string;
}

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
  timesSelected?: number;
  timesCompleted?: number;
  lastSelectedAt?: string;
  tags?: string[];
  location?: WheelContentLocation;
  metadata?: WheelContentMetadata;
  createdAt: string;
  updatedAt: string;
}
