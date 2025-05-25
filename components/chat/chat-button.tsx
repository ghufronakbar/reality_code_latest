"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import ChatInterface from "@/components/chat/chat-interface";

interface ChatButtonProps {
  sellerId: string;
  productId: string;
}

export default function ChatButton({ sellerId, productId }: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="lg" className="shadow-lg" onClick={() => setIsOpen(true)}>
        <MessageSquare className="mr-2 h-4 w-4" />
        Chat with Seller
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Chat with Seller</DialogTitle>
          </DialogHeader>
          <ChatInterface sellerId={sellerId} productId={productId} />
        </DialogContent>
      </Dialog>
    </>
  );
}