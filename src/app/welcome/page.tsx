"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { BadgeCheck, Home, Info, Send } from "lucide-react";
import Link from 'next/link';

const googleFormLink = "https://forms.gle/SrtRVJTH3JE5DzmN7";

export default function WelcomePage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background font-body text-foreground">
      <div className="absolute inset-0 -z-10 h-full w-full bg-blue-950 bg-[linear-gradient(to_right,hsl(var(--primary)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.1)_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_300px,hsl(var(--primary)/0.2),transparent)]"></div>
      </div>
      <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-8 animate-subtle-float">
          <div className="w-full p-1 glowing-border rounded-2xl bg-transparent">
            <div className="relative w-full h-full rounded-2xl p-8 md:p-12 bg-blue-950/80 backdrop-blur-md neumorphism-inset-heavy text-center">

              {formSubmitted ? (
                <>
                  <BadgeCheck className="w-20 h-20 text-accent mx-auto mb-6 animate-pulse-gold" />
                  <h1 className="text-4xl font-bold font-headline mb-4 text-primary-foreground">Thank You!</h1>
                  <p className="text-muted-foreground max-w-md mx-auto mb-8">
                    You have successfully joined the Clock Layer waitlist. Welcome to the revolution!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <Button asChild className="neumorphism-outset-heavy glassmorphism text-foreground">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" /> Go Home
                        </Link>
                     </Button>
                     <Button asChild className="neumorphism-outset-heavy glassmorphism text-foreground">
                        <a href="https://clocklayer1.netlify.app/" target="_blank" rel="noopener noreferrer">
                            <Info className="mr-2 h-4 w-4" /> Learn More
                        </a>
                     </Button>
                     <Button asChild className="neumorphism-outset-heavy glassmorphism text-foreground">
                        <Link href="/contact">
                           <Send className="mr-2 h-4 w-4" /> Contact Us
                        </Link>
                     </Button>
                  </div>
                   <p className="text-xs text-muted-foreground mt-8">
                        If you encountered any complaints during the onboarding process, please don't hesitate to contact us.
                    </p>
                </>
              ) : (
                <>
                  <BadgeCheck className="w-20 h-20 text-accent mx-auto mb-6" />
                  <h1 className="text-4xl font-bold font-headline mb-4 text-primary-foreground">Congratulations & Welcome!</h1>
                  <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                    You have successfully completed all necessary verifications. Please complete this final form to secure your place on the Clock Layer waitlist.
                  </p>
                  <div className="w-full aspect-video rounded-lg overflow-hidden neumorphism-inset-heavy">
                     <iframe
                        src={googleFormLink + "?embedded=true"}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        marginHeight={0}
                        marginWidth={0}
                        onLoad={() => {
                            // A simple way to detect submission is to listen for the load event again after a delay.
                            // This is not foolproof but works for many cases.
                            setTimeout(() => {
                                // This is a trick: we can't truly know if the form was submitted.
                                // Instead, we can assume after a certain time in the future or after a reload.
                                // For a better UX, we'll just show the buttons after a short delay
                                // and let the user feel like they "submitted" it.
                                // A more robust solution needs backend webhooks from Google Forms which is complex.
                                // For now, we will add a button the user can click.
                            }, 5000);
                        }}
                        >
                        Loading…
                    </iframe>
                  </div>
                   <Button onClick={() => setFormSubmitted(true)} className="mt-8 neumorphism-outset-heavy bg-primary text-primary-foreground py-6 text-lg">
                        I have completed the form
                    </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
