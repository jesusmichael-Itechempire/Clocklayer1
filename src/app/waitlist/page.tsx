tsx
"use client"; // This is correctly placed

import { SignUpFlow } from "@/components/signup-flow";
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react'; // Added useEffect here

// Wrapper component to safely use useSearchParams
function ReferralWrapper() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');

  // You can still use useEffect here if needed, but for this component's purpose,
  // reading search params doesn't require useEffect within this specific component.
  // If you had other side effects needed in this wrapper, you'd use it.

  return <SignUpFlow referralCode={referralCode} />;
}

export default function WaitlistPage() {
  // If WaitlistPage itself needed useEffect for something, you would use it here.
  // For example, if you wanted to log something on mount:
  // useEffect(() => {
  //   console.log('Waitlist page mounted');
  // }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-900 to-black">
      <Suspense fallback={<div>Loading...</div>}>
        <ReferralWrapper />
      </Suspense>
    </main>
  );
}
