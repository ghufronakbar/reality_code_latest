"use client";

import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export const SignOutButton = () => {
  return (
    <Button
      variant="destructive"
      className="flex items-center"
      type="submit"
      onClick={() => signOut()}
    >
      <LogOutIcon className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  );
};
