
"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2, User } from "lucide-react";
import type { UserData } from "./types";

interface WaitlistConfirmationDialogProps {
  isOpen: boolean;
  userData: UserData;
}

export const WaitlistConfirmationDialog: FC<WaitlistConfirmationDialogProps> = ({
  isOpen,
  userData,
}) => {
  const router = useRouter();
  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md w-full rounded-2xl flex flex-col items-center justify-center text-center p-10 bg-background neumorphism-outset-heavy glowing-border">
        <div className="z-10 flex flex-col items-center justify-center">
          <CheckCircle2 className="w-16 h-16 text-accent mb-4" />
          <h2 className="text-2xl font-headline font-semibold mb-4">
            Congratulations!
          </h2>
          <Avatar className="w-24 h-24 neumorphism-outset-heavy p-1 mb-4 glowing-border">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <AvatarImage src={userData.profilePicture ?? undefined} />
              <AvatarFallback className="bg-transparent">
                <User />
              </AvatarFallback>
            </div>
          </Avatar>
          <p className="font-semibold text-lg">{userData.name}</p>
          <p className="text-muted-foreground">{userData.username}</p>
          <p className="mt-4">You have successfully joined the waitlist.</p>

          <Button
            onClick={() => router.push("/dashboard")}
            className="mt-8 rounded-full neumorphism-outset-heavy bg-accent text-accent-foreground"
          >
            Go to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
