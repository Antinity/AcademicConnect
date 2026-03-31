export type Role = "student" | "teacher" | "school";

export interface Review {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Teacher {
  id: string;
  name: string;
  title: string;
  subjects: string[];
  rating: number;
  hourlyRate: number;
  bio: string;
  reviews: Review[];
}

export interface PersonProfile {
  id: string;
  name: string;
  role: Role;
  headline?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  messages: Message[];
}

export interface UserSession {
  id: string;
  name: string;
  role: Role;
}
