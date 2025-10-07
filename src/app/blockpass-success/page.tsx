
"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink, Rocket } from "lucide-react";
import Link from 'next/link';

const zealyLink = "https://zealy.io/cw/clocklayer/questboard";

export default function BlockpassSuccessPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background font-body text-foreground">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_50%_200px,hsl(var(--primary)/0.1),transparent)]"></div>
      </div>
      <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8 animate-subtle-float">
          <div className="w-full p-0.5 glowing-border rounded-2xl bg-transparent">
            <div className="relative w-full h-full rounded-2xl p-8 md:p-12 bg-card/80 backdrop-blur-sm neumorphism-inset-heavy text-center">
              <CheckCircle className="w-20 h-20 text-accent mx-auto mb-6" />
              <h1 className="text-4xl font-bold font-headline mb-4">Verification Successful!</h1>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                You have passed the first phase. Now, proceed to Zealy to complete the required quests and secure your spot on the waitlist.
              </p>
              <a href={zealyLink} target="_blank" rel="noopener noreferrer">
                <Button className="neumorphism-outset-heavy bg-primary text-primary-foreground py-6 text-lg">
                  <Rocket className="mr-2 h-5 w-5" /> Continue to Zealy <ExternalLink className="ml-2 h-4 w-4"/>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
