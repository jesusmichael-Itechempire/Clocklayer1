
"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/config";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, Twitter as TwitterIcon } from "lucide-react";
import type { UserData } from "./types";

interface Step1WelcomeProps {
  onNext: () => void;
  waitlistState: { total: number; joined: number };
  updateUserData: (data: Partial<UserData>) => void;
  referralCode: string | null;
}

export const Step1Welcome: FC<Step1WelcomeProps> = ({
  onNext,
  waitlistState,
  updateUserData,
  referralCode,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithOAuth({
        provider: "twitter",
      });

      if (authError) throw authError;

      // The user is redirected to Twitter for auth. The rest of the logic
      // will need to be handled on the page they are redirected back to.
      // For now, we can assume the happy path where they come back and are logged in.
      // A more robust solution would handle the session state upon redirection.

      // NOTE: After OAuth redirection, Supabase handles the session.
      // We need to get user info from the session. A simple way is to listen for an auth state change,
      // but for this flow, we'll get the user after the redirect. Let's assume this component
      // re-renders and we can get the user. A better place for this logic is often a parent component or a layout effect.

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      if (!session) {
          // This might happen if the user is not yet redirected back.
          // The sign-in initiates a redirect. The logic below is for when the user is back.
          // To make this work as a single function is complex without a redirect page.
          // So this will be simplified.
          return;
      }

      const user = session.user;
      const {
        full_name: name,
        user_name: username,
        avatar_url: profilePicture,
      } = user.user_metadata;

      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("hasCompletedZealyTasks")
        .eq("id", user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: "Not a single row was found"
          throw fetchError;
      }

      if (existingUser?.hasCompletedZealyTasks) {
        toast({
          title: "Welcome back!",
          description: "Redirecting you to the dashboard.",
        });
        router.push("/dashboard");
        return;
      }
      
      const userDataForDb: any = {
        id: user.id,
        name: name,
        username: username,
        profile_picture: profilePicture,
        last_login: new Date().toISOString(),
        signup_user_agent: navigator.userAgent,
      };

      if (!existingUser) {
        userDataForDb.created_at = new Date().toISOString();
        if (referralCode) {
            const { data: referrer, error: refError } = await supabase
                .from('users')
                .select('id')
                .eq('username', referralCode)
                .single();
            if (refError) console.error("Referrer fetch error:", refError.message);
            if (referrer) {
                userDataForDb.referred_by = referrer.id;
            }
        }
      }

      const { error: upsertError } = await supabase.from('users').upsert(userDataForDb, { onConflict: 'id' });
      if (upsertError) throw upsertError;

      updateUserData({ name, username, profilePicture });
      onNext();
    } catch (error: any) {
      console.error("X Sign-in error:", error);
      toast({
        title: "Sign-In Failed",
        description: error.message || "Could not connect with X. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // This effect will run when the component mounts and check if the user has been redirected back from OAuth
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
            // Refetch user data and proceed
            handleConnect(); 
        }
    });

    return () => {
        subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-headline font-semibold mb-4">
          Join the Exclusive Waitlist
        </h2>
        <p className="text-muted-foreground mb-6">
          Connect your X account to begin the journey. Only the dedicated will
          ascend.
        </p>
        <div className="flex justify-center gap-4 text-center mb-8">
          <div className="p-4 rounded-lg neumorphism-outset-heavy">
            <div className="text-2xl font-bold font-headline text-primary">
              {waitlistState.total.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Slots</div>
          </div>
          <div className="p-4 rounded-lg neumorphism-outset-heavy">
            <div className="text-2xl font-bold font-headline text-accent">
              {waitlistState.joined.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Joined</div>
          </div>
          <div className="p-4 rounded-lg neumorphism-outset-heavy">
            <div className="text-2xl font-bold font-headline text-primary">
              {(waitlistState.total - waitlistState.joined).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-pink-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <Button
            size="lg"
            className="relative w-full max-w-xs rounded-full shadow-lg bg-background text-foreground"
            onClick={handleConnect}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <TwitterIcon className="mr-2 h-5 w-5" />
            )}
            {isLoading ? "Connecting..." : "Join Waitlist with X"}
          </Button>
        </div>
        <Button
          onClick={handleConnect}
          variant="link"
          className="text-muted-foreground"
          disabled={isLoading}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Already registered? Login
        </Button>
      </div>
    </div>
  );
};
