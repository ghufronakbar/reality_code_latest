import { Message } from "@/types/message";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";
  
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <div className="space-y-1">
          <p className="text-sm">{message.content}</p>
          <div className="flex items-center justify-end gap-1 text-xs opacity-70">
            <span>
              {format(new Date(message.timestamp), "HH:mm")}
            </span>
            {isUser && (
              message.isRead ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}