
"use client";

import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Edit, Phone, User } from "lucide-react";
import type { UserData } from "./types";

interface Step4ConfirmProps {
  onNext: () => void;
  onBack: () => void;
  userData: UserData;
  jumpToStep: (step: number) => void;
}

export const Step4Confirm: FC<Step4ConfirmProps> = ({
  onNext,
  onBack,
  userData,
  jumpToStep,
}) => {
  return (
    <div className="flex flex-col items-center h-full text-center">
      <h2 className="text-2xl font-headline font-semibold mb-2">
        Confirm Your Identity
      </h2>
      <p className="text-muted-foreground mb-8">
        One final look before we proceed.
      </p>
      <div className="w-full max-w-md space-y-6 neumorphism-inset-heavy p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 neumorphism-outset-heavy p-0.5 glowing-border">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <AvatarImage src={userData.profilePicture ?? undefined} />
                <AvatarFallback className="bg-transparent">
                  <User />
                </AvatarFallback>
              </div>
            </Avatar>
            <div>
              <p className="font-semibold">{userData.name}</p>
              <p className="text-sm text-muted-foreground">
                {userData.username}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => jumpToStep(2)}>
            <Edit className="mr-2 h-3 w-3" />
            Edit
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Phone className="w-6 h-6 text-muted-foreground" />
            <p>{userData.phone}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => jumpToStep(3)}>
            <Edit className="mr-2 h-3 w-3" />
            Edit
          </Button>
        </div>
      </div>
      <div className="flex justify-between w-full mt-8 max-w-md">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="neumorphism-outset-heavy"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          className="neumorphism-outset-heavy bg-primary text-primary-foreground"
        >
          Confirm &amp; Proceed
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
