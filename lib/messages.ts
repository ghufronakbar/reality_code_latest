import { Message } from "@/types/message";

// Dummy messages data
const messages: Record<string, Record<string, Message[]>> = {
  "seller1": {
    "1": [
      {
        id: "msg1",
        content: "Hello! I'm interested in your CodeEditor Pro software. Does it support TypeScript?",
        timestamp: "2024-03-15T10:23:45Z",
        sender: "user",
        isRead: true,
      },
      {
        id: "msg2",
        content: "Hi there! Yes, CodeEditor Pro has excellent TypeScript support with intelligent code completion and type checking. Is there anything specific you'd like to know about its TypeScript features?",
        timestamp: "2024-03-15T10:26:12Z",
        sender: "seller",
        isRead: true,
      },
      {
        id: "msg3",
        content: "That's great! Does it integrate with ESLint and Prettier for TypeScript?",
        timestamp: "2024-03-15T10:28:30Z",
        sender: "user",
        isRead: true,
      },
      {
        id: "msg4",
        content: "Absolutely! It has built-in support for ESLint and Prettier. You can set up your preferred configuration, and the editor will automatically format your code and highlight any linting issues.",
        timestamp: "2024-03-15T10:31:05Z",
        sender: "seller",
        isRead: true,
      },
    ],
    "5": [
      {
        id: "msg5",
        content: "I'm considering SecureVault for my team. Do you offer volume licensing?",
        timestamp: "2024-03-14T15:12:22Z",
        sender: "user",
        isRead: true,
      },
      {
        id: "msg6",
        content: "We do offer volume licensing for teams of 5 or more users. I'd be happy to provide you with more information about our pricing tiers and discounts. How many licenses would you need?",
        timestamp: "2024-03-14T15:15:47Z",
        sender: "seller",
        isRead: true,
      },
    ],
  },
  "seller2": {
    "2": [
      {
        id: "msg7",
        content: "Does DesignStudio X support collaborative editing?",
        timestamp: "2024-03-13T09:45:18Z",
        sender: "user",
        isRead: true,
      },
      {
        id: "msg8",
        content: "Yes, DesignStudio X supports real-time collaborative editing. Multiple team members can work on the same file simultaneously, and you can see everyone's changes in real-time. We also have commenting and feedback tools for asynchronous collaboration.",
        timestamp: "2024-03-13T09:48:32Z",
        sender: "seller",
        isRead: true,
      },
    ],
  },
  "seller3": {
    "3": [],
    "6": [
      {
        id: "msg9",
        content: "Hi, I'm having trouble with the motion tracking feature in VideoEdit Master. Can you help?",
        timestamp: "2024-03-12T14:22:56Z",
        sender: "user",
        isRead: true,
      },
      {
        id: "msg10",
        content: "I'm sorry to hear you're having trouble. The motion tracking feature works best with high-contrast footage. Could you tell me more about what you're trying to track and what issues you're experiencing?",
        timestamp: "2024-03-12T14:25:18Z",
        sender: "seller",
        isRead: true,
      },
      {
        id: "msg11",
        content: "I'm trying to track a person walking across the frame, but the tracker keeps losing them when they walk in front of a similar colored background.",
        timestamp: "2024-03-12T14:28:43Z",
        sender: "user",
        isRead: true,
      },
      {
        id: "msg12",
        content: "That's a common challenge with motion tracking. For cases like this, I recommend using the 'Points Tracking' method instead of 'Object Tracking'. Select 3-5 high-contrast points on the person (like shirt buttons or face features) and track those points instead. This usually works better for subjects that blend with backgrounds. Would you like me to send you a short tutorial video on this?",
        timestamp: "2024-03-12T14:32:10Z",
        sender: "seller",
        isRead: true,
      },
    ],
  },
};

// Function to get messages between seller and user for a specific product
export function getMessages(sellerId: string, productId: string): Message[] {
  if (messages[sellerId] && messages[sellerId][productId]) {
    return messages[sellerId][productId];
  }
  return [];
}

// Function to add a new message
export function addMessage(sellerId: string, productId: string, message: Message): void {
  if (!messages[sellerId]) {
    messages[sellerId] = {};
  }
  
  if (!messages[sellerId][productId]) {
    messages[sellerId][productId] = [];
  }
  
  messages[sellerId][productId].push(message);
}