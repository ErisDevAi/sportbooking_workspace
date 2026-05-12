export interface Backup {
  _id: string;
  filename: string;
  size: number;
  collections: string[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
  } | string;
  note: string;
  createdAt: string;
  updatedAt: string;
}
