export interface Highlight {
  id: string;
  content: string;
  book: string;
  author: string;
  tags: string[];
  date: Date;
  lastReviewed: Date | null;
  nextReview: Date;
  easeFactor: number;
  interval: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  highlights: number;
  coverUrl: string | null;
  dateAdded: Date;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: Date;
  userId: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  content: string;
  folderId: string;
  userId: string;
  createdAt: Date;
  lastReviewed: Date | null;
}

export interface EmailSettings {
  id: string;
  userId: string;
  sendTime: string; // Format: "HH:mm"
  frequency: number; // Days between emails
  selectedFolders: string[]; // Array of folder IDs
  lastSent: Date | null;
}