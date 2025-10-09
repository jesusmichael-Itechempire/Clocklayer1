'use client';

import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink, AlertTriangle } from "lucide-react";

const zealyLink = "https://zealy.io/cw/clocklayer/questboard";

export default function RecaptchaSuccessPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background font-body text-foreground">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_50%_200px,hsl(var(--primary)/0.1),transparent)]"></div>
      </div>
      <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8 animate-subtle-float">
          <div className="w-full p-0.5 glowing-border rounded-2xl bg-transparent">
            <div className="relative w-full h-full rounded-2xl p-8 md:p-12 bg-card/80 backdrop-blur-sm neumorphism-inset-heavy text-center">

              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h1 className="text-3xl font-bold font-headline mb-3">Human Verification Passed!</h1>
              <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm">
                You have successfully completed the first step. Now, you must complete the required quests on Zealy to finalize your entry to the waitlist.
              </p>
              <a href={zealyLink} target="_blank" rel="noopener noreferrer">
                <Button className="neumorphism-outset-heavy bg-primary text-white py-2 px-4 text-sm font-bold mb-6 animate-pulse-mix">
                  <ExternalLink className="mr-2 h-4 w-4" /> Continue to Zealy Quests
                </Button>
              </a>
              <div className="mt-4 p-4 bg-amber-900/20 border border-amber-500/50 rounded-lg text-left">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-amber-300">Crucial Final Step</h3>
                    <p className="text-xs text-amber-300/80 mt-1">
                      To be successfully added to the waitlist, you must complete all tasks on Zealy. This includes the Blockpass KYC verification task. Skipping any task will result in an incomplete application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
