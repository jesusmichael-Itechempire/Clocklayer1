'use client';

import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Rocket } from 'lucide-react';

export default function WaitlistPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          if (videoRef.current) {
            videoRef.current.muted = false;
          }
        })
        .catch(error => {
          console.error('Autoplay with sound was prevented.', error);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play();
          }
        });
    }
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        poster="https://res.cloudinary.com/dqouvpe2s/image/upload/v1755912425/3d-male-avatar-cartoon-man-with-glasses-Bnq3PC7J_ptuw5m.jpg"
      >
        <source src="/videos/waitlist-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white bg-black bg-opacity-50 p-4">
        <h1 className="text-4xl font-bold mb-4">Be among the first adopters</h1>
        <Link href="https://verify-with.blockpass.org/?clientId=clock_layer_waitlist_29249" passHref>
          <Button className="glassmorphism text-white py-3 px-6 text-md font-bold mb-8 animate-pulse-mix">
            <Rocket className="mr-2 h-5 w-5" />
            Join Waitlist
          </Button>
        </Link>
        <div className="glassmorphism-light p-6 rounded-lg max-w-2xl text-sm">
          <h2 className="text-lg font-semibold mb-4">Your Journey to the Waitlist:</h2>
          <ol className="list-decimal list-inside text-left space-y-3">
            <li>
              <span className="font-bold">Identity Verification:</span> Click the button above to
              complete a quick and secure KYC verification through Blockpass.
            </li>
            <li>
              <span className="font-bold">Engage and Earn:</span> After verification, you'll be
              directed to Zealy. Complete the designated tasks to become an active part of our
              community.
            </li>
            <li>
              <span className="font-bold">Final Confirmation:</span> Once your tasks on Zealy are
              done, you'll return to our site to finalize your waitlist submission. It is crucial
              not to miss any step to secure your spot.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
