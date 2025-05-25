export interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: "user" | "seller";
  isRead: boolean;
}