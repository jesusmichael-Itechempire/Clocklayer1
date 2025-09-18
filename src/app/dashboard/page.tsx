"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/config';
import { UserProfileCard } from '@/components/dashboard/user-profile-card';
import { ReferralList } from '@/components/dashboard/referral-list'; // Corrected Import
import { InboxPanel } from '@/components/dashboard/inbox-panel';
import { User as AuthUser } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

// Define a more specific type for your user data
export interface UserProfile {
  id: string;
  name: string;
  username: string;
  profile_picture: string;
  phone: string;
  referral_code: string;
  referred_by: string | null;
  points: number;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        router.push('/waitlist');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        router.push('/waitlist'); 
      } else {
        setUserProfile(data);
      }
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  if (loading || !userProfile) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-8">
        <UserProfileCard user={userProfile} />
      </div>
      <div className="lg:col-span-2 space-y-8">
        <ReferralList user={userProfile} />
        <InboxPanel userId={userProfile.id} />
      </div>
    </div>
  );
}
