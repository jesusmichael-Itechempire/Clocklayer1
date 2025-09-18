"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Gift, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/app/dashboard/page';

interface ReferralListProps {
  user: UserProfile;
}

interface Referral {
    id: string;
    name: string;
    username: string;
}

export function ReferralList({ user }: ReferralListProps) {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const referralLink = `https://clocklayer1.netlify.app/waitlist?ref=${user.referral_code}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: 'Copied to clipboard!' });
  };

  useEffect(() => {
    if (!user.id) return;
    const fetchReferrals = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('id, name, username')
        .eq('referred_by', user.id);

      if (error) {
        console.error('Error fetching referrals:', error);
      } else {
        setReferrals(data || []);
      }
      setLoading(false);
    };

    fetchReferrals();
  }, [user.id]);

  return (
    <Card className="neumorphism-outset-heavy">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Gift /> Referral System
        </CardTitle>
        <CardDescription>
          Invite others and earn points. You get 100 points for every person who signs up using your link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Your Unique Referral Link</h4>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="neumorphism-inset-heavy"/>
              <Button onClick={copyToClipboard} variant="outline" size="icon" className="neumorphism-outset-heavy">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Your Referrals ({referrals.length})</h4>
            {loading ? (
                <p>Loading...</p>
            ) : referrals.length === 0 ? (
                 <div className="text-center p-4 border-2 border-dashed rounded-lg">
                    <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2"/>
                    <p className="text-sm font-semibold">No referrals yet.</p>
                    <p className="text-xs text-muted-foreground">Share your link to get started!</p>
                </div>
            ) : (
                <ul className="mt-2 space-y-3 p-3 neumorphism-inset-heavy rounded-lg max-h-48 overflow-y-auto">
                    {referrals.map(ref => (
                        <li key={ref.id} className="text-sm p-2 bg-background/50 rounded">
                            {ref.name} (@{ref.username})
                        </li>
                    ))}
                </ul>
            )}
          </div>
           <div>
            <h4 className="font-semibold">Your Points</h4>
            <p className="text-3xl font-bold text-primary">{user.points || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
