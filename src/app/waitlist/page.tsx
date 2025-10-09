'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";

export default function WaitlistPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      // Attempt to play with sound
      videoRef.current.play().then(() => {
        // If successful, ensure it's not muted
        if(videoRef.current) videoRef.current.muted = false;
      }).catch(error => {
        // If it fails (likely due to autoplay policy), mute and play
        console.log("Autoplay with sound was prevented. Playing muted.");
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      });
    }
  }, []);

  const handleCaptchaChange = (value: string | null) => {
    if (value) {
      setIsVerified(true);
      router.push('/success');
    }
  };

  const handleJoinClick = () => {
    recaptchaRef.current?.execute();
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/waitlist-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white bg-black bg-opacity-50 p-4">
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          onChange={handleCaptchaChange}
        />
        <h1 className="text-4xl font-bold mb-4">Be among the first adopters</h1>
        <Button 
          onClick={handleJoinClick} 
          className="glassmorphism text-white py-3 px-6 text-md font-bold mb-8 animate-pulse-mix"
        >
          <Rocket className="mr-2 h-5 w-5" />
          Join Waitlist
        </Button>
        <div className="glassmorphism-light p-6 rounded-lg max-w-2xl text-sm">
          <h2 className="text-lg font-semibold mb-4">Your Journey to the Waitlist:</h2>
          <ol className="list-decimal list-inside text-left space-y-3">
            <li>
              <span className="font-bold">Human Verification:</span> Click the button above to prove you're human. It keeps our waitlist fair.
            </li>
            <li>
              <span className="font-bold">Complete Zealy Quests:</span> After verification, you will be taken to our success page. From there, proceed to Zealy to complete all required community tasks, including the Blockpass KYC.
            </li>
            <li>
              <span className="font-bold">Secure Your Spot:</span> Every task on Zealy is mandatory. Completing them all is the only way to secure your spot on the waitlist.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
