"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

interface Props {
  className?: string;
}

export const SignOutButton: React.FC<Props> = ({ className }) => {
  return (
    <Button
      variant="destructive"
      className={cn("flex items-center", className)}
      type="submit"
      onClick={() => signOut()}
    >
      <LogOutIcon className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  );
};
