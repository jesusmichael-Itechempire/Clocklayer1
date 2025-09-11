
"use client";

import { FC, useRef, useState } from "react";
import Script from "next/script";
import { supabase } from "@/supabase/config";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Rocket,
} from "lucide-react";

const MINIMUM_XP_REQUIRED = 2000;

interface Step6ZealyProps {
  onConfirm: () => void;
  onBack: () => void;
}

export const Step6Zealy: FC<Step6ZealyProps> = ({ onConfirm, onBack }) => {
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const zealyInitialized = useRef(false);
  const zealyQuestboardUrl =
    "https://zealy.io/cw/clocklayer/questboard/63d4c95e-bcc3-460d-8ed2-0c86812d6f16";

  const handleZealyConnect = () => {
    const zealy = (window as any).zealy;
    if (zealy) {
      zealy.connect();
    } else {
      toast({
        title: "Zealy Not Loaded",
        description:
          "The Zealy script hasn't loaded yet. Please wait a moment and try again.",
        variant: "destructive",
      });
    }
  };

  const handleScriptLoad = () => {
    const zealy = (window as any).zealy;
    if (zealy && !zealyInitialized.current) {
      zealy.init(process.env.NEXT_PUBLIC_ZEALY_API_KEY);

      zealy.on("connect", async (user: { id: string; xp: number }) => {
        setIsVerifying(true);
        try {
          if (user.xp < MINIMUM_XP_REQUIRED) {
            toast({
              title: "Not enough XP",
              description: `You have ${user.xp} XP, but you need ${MINIMUM_XP_REQUIRED}. Please complete more tasks on Zealy.`,
              variant: "destructive",
            });
            setIsVerifying(false);
            return;
          }

          const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
          if (authError || !authUser) {
            toast({
              title: "Authentication Error",
              description: "You must be signed in.",
              variant: "destructive",
            });
            setIsVerifying(false);
            return;
          }

          const { error: dbError } = await supabase.from('users').update({
            has_completed_zealy_tasks: true,
            zealy_id: user.id,
            zealy_xp: user.xp,
          }).eq('id', authUser.id);

          if (dbError) throw dbError;
          
          toast({
            title: "Success!",
            description: `Verified with ${user.xp} XP. You're on the waitlist!`,
            className: "bg-accent text-accent-foreground",
          });
          onConfirm();

        } catch (error: any) {
          console.error("Zealy verification error:", error);
          toast({
            title: "An Error Occurred",
            description:
              error.message || "Could not complete Zealy verification.",
            variant: "destructive",
          });
        } finally {
          setIsVerifying(false);
        }
      });

      zealyInitialized.current = true;
    }
  };

  return (
    <>
      <Script
        src="https://widget.zealy.io/connect.js"
        onLoad={handleScriptLoad}
        onError={() =>
          toast({
            title: "Zealy script failed to load",
            description: "Please check your connection or ad-blocker.",
            variant: "destructive",
          })
        }
        async
      />
      <div className="flex flex-col items-center h-full text-center">
        <h2 className="text-2xl font-headline font-semibold mb-2">
          The Final Ascent
        </h2>
        <p className="text-muted-foreground mb-8">
          Complete quests on Zealy to earn {MINIMUM_XP_REQUIRED} XP and secure
          your spot.
        </p>

        <div className="w-full max-w-md space-y-6 neumorphism-inset-heavy p-6 rounded-lg text-left mb-8">
          <div className="flex items-start gap-4">
            <div className="font-bold text-lg text-primary">1.</div>
            <div>
              <h3 className="font-semibold">Complete Quests on Zealy</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Click the button below to be redirected to our Zealy
                questboard. You will need to complete several tasks to earn a
                total of {MINIMUM_XP_REQUIRED} XP.
              </p>
              <ul className="list-disc list-outside text-sm text-muted-foreground space-y-2 pl-4 mb-4">
                <li>Access the "Clock Layer Testnet Airdrop" module.</li>
                <li>Connect your wallet and Telegram account.</li>
                <li>
                  Complete the "Genesis Waitlist Integration" quests to claim
                  1,000 XP.
                </li>
                <li>
                  Complete the "Genesis Waitlist Tasks Completion" quests to
                  claim another 1,000 XP.
                </li>
              </ul>
              <Button asChild variant="outline" className="neumorphism-outset-heavy">
                <a
                  href={zealyQuestboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Go to Zealy Questboard <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="font-bold text-lg text-primary">2.</div>
            <div>
              <h3 className="font-semibold">Verify Your Status</h3>
              <p className="text-sm text-muted-foreground mb-4">
                After completing the quests and claiming your XP on Zealy,
                return here and click the "Connect with Zealy" button below to
                verify your status and join the waitlist.
              </p>
              <div className="relative group w-fit">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <Button
                  className="relative rounded-full shadow-lg bg-background text-foreground"
                  onClick={handleZealyConnect}
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Rocket className="mr-2 h-5 w-5" />
                  )}
                  {isVerifying ? "Verifying..." : "Connect with Zealy"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between w-full mt-2 max-w-md">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isVerifying}
            className="neumorphism-outset-heavy"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
    </>
  );
};
