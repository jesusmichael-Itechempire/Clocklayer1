"use client";

// THE FIX IS ON THIS LINE: We are adding 'useEffect' to the import from "react"
import { useState, useEffect } from "react"; 

import { supabase } from "@/supabase/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Step1Welcome } from "./signup-flow/step1-welcome";
import { Step2Profile } from "./signup-flow/step2-profile";
import { Step3Phone } from "./signup-flow/step3-phone";
import { Step4Confirm } from "./signup-flow/step4-confirm";
import { Step5Facial } from "./signup-flow/step5-facial";
import { Step6Zealy } from "./signup-flow/step6-zealy";
import { WaitlistConfirmationDialog } from "./signup-flow/waitlist-confirmation-dialog";
import type { UserData } from "./signup-flow/types";

const TOTAL_STEPS = 6;
const TOTAL_SLOTS = 30000;

const initialUserData: UserData = {
  name: "",
  username: "",
  profilePicture: null,
  phone: "",
};

export function SignUpFlow({ referralCode }: { referralCode: string | null }) {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [waitlistState, setWaitlistState] = useState({ total: TOTAL_SLOTS, joined: 0 });
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const fetchWaitlistCount = async () => {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('has_completed_zealy_tasks', true)

      if (error) {
        console.error('Error fetching waitlist count:', error);
      } else {
        setWaitlistState(prevState => ({ ...prevState, joined: count ?? 0 }));
      }
    };

    fetchWaitlistCount();

    const changes = supabase.channel('table-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        fetchWaitlistCount(); // Refetch on any change to the users table
      })
      .subscribe()

    return () => {
        supabase.removeChannel(changes)
    }
  }, []);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));
  const jumpToStep = (step: number) => setStep(step);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const onConfirm = () => {
    setIsConfirmed(true);
    // Optimistic update for instant feedback
    setWaitlistState((prev) => ({ ...prev, joined: prev.joined + 1 }));
  };

  const progress = (step / TOTAL_STEPS) * 100;

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Welcome onNext={handleNext} waitlistState={waitlistState} updateUserData={updateUserData} referralCode={referralCode} />;
      case 2:
        return <Step2Profile onNext={handleNext} onBack={handleBack} userData={userData} updateUserData={updateUserData} />;
      case 3:
        return <Step3Phone onNext={handleNext} onBack={handleBack} userData={userData} updateUserData={updateUserData} />;
      case 4:
        return <Step4Confirm onNext={handleNext} onBack={handleBack} userData={userData} jumpToStep={jumpToStep} />;
      case 5:
        return <Step5Facial onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <Step6Zealy onConfirm={onConfirm} onBack={handleBack} />;
      default:
        return <Step1Welcome onNext={handleNext} waitlistState={waitlistState} updateUserData={updateUserData} referralCode={referralCode} />;
    }
  };

  return (
    <>
      <div className="w-full max-w-2xl rounded-2xl p-0.5 glowing-border animate-subtle-float">
        <Card className="w-full h-full bg-card neumorphism-outset-heavy border-0">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-center text-foreground/90 tracking-wider">
              Clocklayer Waitlist
            </CardTitle>
            <CardDescription className="text-center">
              Follow the steps to secure your spot.
            </CardDescription>
            <div className="pt-4">
              <Progress value={progress} className="h-2 bg-primary/20" />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <span key={i} className={`w-1/6 text-center ${i + 1 <= step ? "font-bold text-primary-foreground" : ""}`}>\n                    {i + 1}\n                  </span>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="min-h-[400px]">
            {renderStep()}
          </CardContent>
        </Card>
      </div>
      <WaitlistConfirmationDialog isOpen={isConfirmed} userData={userData} />
    </>
  );
}
