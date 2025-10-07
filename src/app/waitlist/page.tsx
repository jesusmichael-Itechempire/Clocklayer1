"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink, Rocket, ShieldCheck } from "lucide-react";
import Link from 'next/link';

const blockpassLink = "https://verify-with.blockpass.org/?clientId=clock_layer_waitlist_29249";

export default function WaitlistPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-body text-foreground">
      {/* Background Video */}
      <iframe
        src="https://player.cloudinary.com/embed/?cloud_name=dvsm5fbmc&public_id=215598-medium-MERGE_aifkay&profile=cld-default&autoplay=1&mute=1&loop=1&controls=0"
        width="1920"
        height="1080"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100vw',
          height: '100vh',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          zIndex: 0,
        }}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        frameBorder="0"
      ></iframe>
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      <main className="relative z-20 flex min-h-screen w-full flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-12 animate-subtle-float">
          
          {/* Title */}
          <div className="w-full p-1 glowing-border rounded-2xl bg-transparent">
             <div className="relative w-full h-full rounded-2xl p-8 text-center bg-card/10 backdrop-blur-sm neumorphism-inset-heavy">
                 <h1 className="text-3xl md:text-5xl font-bold font-headline leading-tight tracking-tight text-shadow-lg text-primary-foreground">
                    Join <span className="text-primary">Clock Layer</span> and revolutionize the security of Blockchain, recreating a super powerful <span className="text-primary">AI intelligent</span> and <span className="text-primary">biometric secure</span> layer.
                </h1>
             </div>
          </div>

          {/* Instructions */}
          <div className="w-full p-0.5 glowing-border rounded-2xl bg-transparent">
            <div className="relative w-full h-full rounded-2xl p-8 bg-card/10 backdrop-blur-sm neumorphism-inset-heavy">
              <h2 className="text-2xl font-headline font-bold text-center mb-6 flex items-center justify-center gap-2"><ShieldCheck className="text-primary"/> Waitlist Process</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-4">
                  <CheckCircle className="text-accent mt-1 shrink-0"/>
                  <div>
                    <span className="font-semibold text-foreground">Step 1: Identity Verification</span>
                    <p className="text-sm">Click the 'Join Waitlist' button to begin your secure identity verification with our partner, Blockpass.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle className="text-accent mt-1 shrink-0"/>
                  <div>
                    <span className="font-semibold text-foreground">Step 2: Complete Zealy Quests</span>
                    <p className="text-sm">After successful verification, you'll be redirected to complete essential tasks on Zealy to secure your spot.</p>
                  </div>
                </li>
                 <li className="flex items-start gap-4">
                  <CheckCircle className="text-accent mt-1 shrink-0"/>
                  <div>
                    <span className="font-semibold text-foreground">Step 3: Final Confirmation</span>
                    <p className="text-sm">The final task on Zealy will lead you to our confirmation page, where you'll finalize your entry by completing a form.</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6 text-center p-4 bg-destructive/10 border border-destructive/50 rounded-lg">
                <p className="font-bold text-destructive-foreground">Important: You must complete all steps in order to successfully join the waitlist. Do not stop midway.</p>
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="text-center">
            <a href={blockpassLink} target="_blank" rel="noopener noreferrer">
              <Button asChild={false} type="button" className="w-full max-w-sm neumorphism-outset-heavy bg-primary text-primary-foreground py-8 text-xl shadow-2xl hover:shadow-primary/50 transition-shadow duration-300">
                  <div><Rocket className="mr-3 h-6 w-6" /> Join Waitlist</div>
              </Button>
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}