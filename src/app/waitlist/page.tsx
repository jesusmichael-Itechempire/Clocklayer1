'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from "react-google-recaptcha";

export default function WaitlistPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isCaptchaReady, setIsCaptchaReady] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      console.error("FATAL: NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable is not set.");
      console.error("Please add this to your deployment environment variables.");
      setIsCaptchaReady(false);
    } else {
      setIsCaptchaReady(true);
    }

    if (videoRef.current) {
      videoRef.current.play().then(() => {
        if(videoRef.current) videoRef.current.muted = false;
      }).catch(error => {
        console.log("Autoplay with sound was prevented. Playing muted.");
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      });
    }
  }, [siteKey]);

  const handleCaptchaChange = (value: string | null) => {
    if (value) {
      // The user has passed the test. Redirect them.
      router.push('/success');
    }
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
        
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-cyan-400">Be among the </span>
          <span className="text-pink-500">first adopters</span>
        </h1>
        
        <div className="mb-2">
            {isCaptchaReady && siteKey ? (
                <ReCAPTCHA
                    ref={recaptchaRef}
                    size="normal" // Keep the widget visible
                    sitekey={siteKey}
                    onChange={handleCaptchaChange}
                    theme="dark" // Use the dark theme to match the background
                />
            ) : (
                <p>Loading verification...</p>
            )}
        </div>
        <p className="text-lg font-semibold text-white mb-8">Join the Waitlist</p>

        <div className="glassmorphism-light p-6 rounded-lg max-w-2xl text-sm">
          <h2 className="text-lg font-semibold mb-4">Your Journey to the Waitlist:</h2>
          <ol className="list-decimal list-inside text-left space-y-3">
            <li>
              <span className="font-bold">Human Verification:</span> Verify you're human with the reCAPTCHA challenge above. It keeps our waitlist fair.
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
