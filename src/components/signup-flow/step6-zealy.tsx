"use client";

import { FC, useRef, useState, useEffect } from "react"; // Added useEffect here
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
          if (authError || !authUser) {\n            toast({\n              title: \"Authentication Error\",\n              description: \"You must be signed in.\",\n              variant: \"destructive\",\n            });\n            setIsVerifying(false);\n            return;\n          }\n\n          const { error: dbError } = await supabase.from(\'users\').update({\n            has_completed_zealy_tasks: true,\n            zealy_id: user.id,\n            zealy_xp: user.xp,\n          }).eq(\'id\', authUser.id);\n\n          if (dbError) throw dbError;\n          \n          toast({\n            title: \"Success!\",\n            description: `Verified with ${user.xp} XP. You\'re on the waitlist!`,\n            className: \"bg-accent text-accent-foreground\",\n          });\n          onConfirm();\n\n        } catch (error: any) {\n          console.error(\"Zealy verification error:\", error);\n          toast({\n            title: \"An Error Occurred\",\n            description:\n              error.message || \"Could not complete Zealy verification.\",\n            variant: \"destructive\",\n          });\n        } finally {\n          setIsVerifying(false);\n        }\n      });\n\n      zealyInitialized.current = true;\n    }\n  };\n\n  useEffect(() => {\n    // This effect is already present and correctly using useEffect\n    // The fix is to add the import above.\n  }, []);\n\n  return (\n    <>\n      <Script\n        src=\"https://widget.zealy.io/connect.js\"\n        onLoad={handleScriptLoad}\n        onError={() =>\n          toast({\n            title: \"Zealy script failed to load\",\n            description: \"Please check your connection or ad-blocker.\",\n            variant: \"destructive\",\n          })\n        }\n        async\n      />\n      <div className=\"flex flex-col items-center h-full text-center\">\n        <h2 className=\"text-2xl font-headline font-semibold mb-2\">\n          The Final Ascent\n        </h2>\n        <p className=\"text-muted-foreground mb-8\">\n          Complete quests on Zealy to earn {MINIMUM_XP_REQUIRED} XP and secure\n          your spot.\n        </p>\n\n        <div className=\"w-full max-w-md space-y-6 neumorphism-inset-heavy p-6 rounded-lg text-left mb-8\">\n          <div className=\"flex items-start gap-4\">\n            <div className=\"font-bold text-lg text-primary\">1.</div>\n            <div>\n              <h3 className=\"font-semibold\">Complete Quests on Zealy</h3>\n              <p className=\"text-sm text-muted-foreground mt-1 mb-4\">\n                Click the button below to be redirected to our Zealy\n                questboard. You will need to complete several tasks to earn a\n                total of {MINIMUM_XP_REQUIRED} XP.\n              </p>\n              <ul className=\"list-disc list-outside text-sm text-muted-foreground space-y-2 pl-4 mb-4\">\n                <li>Access the \"Clock Layer Testnet Airdrop\" module.</li>\n                <li>Connect your wallet and Telegram account.</li>\n                <li>\n                  Complete the \"Genesis Waitlist Integration\" quests to claim\n                  1,000 XP.\n                </li>\n                <li>\n                  Complete the \"Genesis Waitlist Tasks Completion\" quests to\n                  claim another 1,000 XP.\n                </li>\n              </ul>\n              <Button asChild variant=\"outline\" className=\"neumorphism-outset-heavy\">\n                <a\n                  href={zealyQuestboardUrl}\n                  target=\"_blank\"\n                  rel=\"noopener noreferrer\"\n                >\n                  Go to Zealy Questboard <ExternalLink className=\"ml-2 h-4 w-4\" />\n                </a>\n              </Button>\n            </div>\n          </div>\n          <div className=\"flex items-start gap-4\">\n            <div className=\"font-bold text-lg text-primary\">2.</div>\n            <div>\n              <h3 className=\"font-semibold\">Verify Your Status</h3>\n              <p className=\"text-sm text-muted-foreground mb-4\">\n                After completing the quests and claiming your XP on Zealy,\n                return here and click the \"Connect with Zealy\" button below to\n                verify your status and join the waitlist.\n              </p>\n              <div className=\"relative group w-fit\">\n                <div className=\"absolute -inset-0.5 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt\"></div>\n                <Button\n                  className=\"relative rounded-full shadow-lg bg-background text-foreground\"\n                  onClick={handleZealyConnect}\n                  disabled={isVerifying}\n                >\n                  {isVerifying ? (\n                    <Loader2 className=\"mr-2 h-5 w-5 animate-spin\" />\n                  ) : (\n                    <Rocket className=\"mr-2 h-5 w-5\" />\n                  )}\n                  {isVerifying ? \"Verifying...\" : \"Connect with Zealy\"}\n                </Button>\n              </div>\n            </div>\n          </div>\n        </div>\n\n        <div className=\"flex justify-between w-full mt-2 max-w-md\">\n          <Button\n            type=\"button\"\n            variant=\"outline\"\n            onClick={onBack}\n            disabled={isVerifying}\n            className=\"neumorphism-outset-heavy\"\n          >\n            <ArrowLeft className=\"mr-2 h-4 w-4\" />\n            Back\n          </Button>\n        </div>\n      </div>\n    </>\n  );\n};\n
