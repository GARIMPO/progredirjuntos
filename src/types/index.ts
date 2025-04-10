
export interface ProfileData {
  id: string;
  name: string;
  image: string;
  phone?: string;
  email?: string;
  wishlist?: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

export interface Goal {
  id: string;
  title: string;
  objective: string;
  details: string;
  completed: boolean;
  archived: boolean;
  createdAt: Date;
}
