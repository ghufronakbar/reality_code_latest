"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Send } from "lucide-react";
import { MappedSellerById } from "@/app/sellers/[id]/page";

interface Props {
  item: MappedSellerById;
}

export default function SellerContact({ item }: Props) {
  const [message, setMessage] = useState("");

  if (!item) {
    return null;
  }
  const { seller } = item;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle message submission
    console.log("Message sent:", message);
    setMessage("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Seller</CardTitle>
        <CardDescription>Send a message to {seller.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
