"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { getMessages } from "@/lib/messages";
import { Message } from "@/types/message";
import ChatMessage from "@/components/chat/chat-message";

interface ChatInterfaceProps {
  sellerId: string;
  productId: string;
}

export default function ChatInterface({ sellerId, productId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load initial messages
    const initialMessages = getMessages(sellerId, productId);
    setMessages(initialMessages);
  }, [sellerId, productId]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === "") return;
    
    // Add new message
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: "user",
      isRead: false,
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    
    // Simulate seller response after delay
    setTimeout(() => {
      const responseMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        content: "Thank you for your message! I'll get back to you as soon as possible.",
        timestamp: new Date().toISOString(),
        sender: "seller",
        isRead: true,
      };
      
      setMessages((prev) => [...prev, responseMsg]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t mt-auto">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}