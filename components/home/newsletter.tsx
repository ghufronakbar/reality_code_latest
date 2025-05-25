"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmail("");
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
    }, 1000);
  };

  return (
    <section className="container px-4 mx-auto">
      <div className="rounded-xl bg-card border p-8 md:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Stay updated with the latest in software
          </h2>
          <p className="mt-4 text-muted-foreground">
            Subscribe to our newsletter to receive updates on new products, 
            exclusive deals, and tips to improve your workflow.
          </p>
        </div>
        
        <form 
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row sm:gap-3"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        
        <p className="mt-4 text-center text-xs text-muted-foreground">
          By subscribing, you agree to our{" "}
          <a href="/terms" className="underline underline-offset-2">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </section>
  );
}