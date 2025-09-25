"use client";

import { SignUpFlow } from "@/components/signup-flow";
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react'; 

// Wrapper component to safely use useSearchParams
function ReferralWrapper() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');

  return <SignUpFlow referralCode={referralCode} />;
}

export default function WaitlistPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-900 to-black">
      <Suspense fallback={<div>Loading...</div>}>
        <ReferralWrapper />
      </Suspense>
    </main>
  );
}
