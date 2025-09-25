"use client";

import { FC, useState, useEffect } from "react"; // Added useEffect here
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
      // We need to get user info from the session. A simple way is to listen for an auth state change,\n      // but for this flow, we\'ll get the user after the redirect. Let\'s assume this component\n      // re-renders and we can get the user. A better place for this logic is often a parent component or a layout effect.\n\n      const { data: { session }, error: sessionError } = await supabase.auth.getSession();\n\n      if (sessionError) throw sessionError;\n      if (!session) {\n          // This might happen if the user is not yet redirected back.\n          // The sign-in initiates a redirect. The logic below is for when the user is back.\n          // To make this work as a single function is complex without a redirect page.\n          // So this will be simplified.\n          return;\n      }\n\n      const user = session.user;\n      const {\n        full_name: name,\n        user_name: username,\n        avatar_url: profilePicture,\n      } = user.user_metadata;\n\n      const { data: existingUser, error: fetchError } = await supabase\n        .from(\"users\")\n        .select(\"has_completed_zealy_tasks\")\n        .eq(\"id\", user.id)\n        .single();\n\n      if (fetchError && fetchError.code !== \'PGRST116\') { // PGRST116: \"Not a single row was found\"\n          throw fetchError;\n      }\n\n      if (existingUser?.hasCompletedZealyTasks) {\n        toast({\n          title: \"Welcome back!\",\n          description: \"Redirecting you to the dashboard.\",\n        });\n        router.push(\"/dashboard\");\n        return;\n      }\n      \n      const userDataForDb: any = {\n        id: user.id,\n        name: name,\n        username: username,\n        profile_picture: profilePicture,\n        last_login: new Date().toISOString(),\n        signup_user_agent: navigator.userAgent,\n      };\n\n      if (!existingUser) {\n        userDataForDb.created_at = new Date().toISOString();\n        if (referralCode) {\n            const { data: referrer, error: refError } = await supabase\n                .from(\'users\')\n                .select(\'id\')\n                .eq(\'username\', referralCode)\n                .single();\n            if (refError) console.error(\"Referrer fetch error:\", refError.message);\n            if (referrer) {\n                userDataForDb.referred_by = referrer.id;\n            }\n        }\n      }\n\n      const { error: upsertError } = await supabase.from(\'users\').upsert(userDataForDb, { onConflict: \'id\' });\n      if (upsertError) throw upsertError;\n\n      updateUserData({ name, username, profilePicture });\n      onNext();\n    } catch (error: any) {\n      console.error(\"X Sign-in error:\", error);\n      toast({\n        title: \"Sign-In Failed\",\n        description: error.message || \"Could not connect with X. Please try again.\",\n        variant: \"destructive\",\n      });\n    } finally {\n      setIsLoading(false);\n    }\n  };\n\n  // This effect will run when the component mounts and check if the user has been redirected back from OAuth\n  useEffect(() => {\n    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {\n        if (event === \'SIGNED_IN\' && session) {\n            // Refetch user data and proceed\n            handleConnect(); \n        }\n    });\n\n    return () => {\n        subscription.unsubscribe();\n    };\n  // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, []);\n\n  return (\n    <div className=\"flex flex-col items-center justify-center h-full text-center p-8\">\n      <div className=\"mb-8\">\n        <h2 className=\"text-2xl font-headline font-semibold mb-4\">\n          Join the Exclusive Waitlist\n        </h2>\n        <p className=\"text-muted-foreground mb-6\">\n          Connect your X account to begin the journey. Only the dedicated will\n          ascend.\n        </p>\n        <div className=\"flex justify-center gap-4 text-center mb-8\">\n          <div className=\"p-4 rounded-lg neumorphism-outset-heavy\">\n            <div className=\"text-2xl font-bold font-headline text-primary\">\n              {waitlistState.total.toLocaleString()}\n            </div>\n            <div className=\"text-xs text-muted-foreground\">Total Slots</div>\n          </div>\n          <div className=\"p-4 rounded-lg neumorphism-outset-heavy\">\n            <div className=\"text-2xl font-bold font-headline text-accent\">\n              {waitlistState.joined.toLocaleString()}\n            </div>\n            <div className=\"text-xs text-muted-foreground\">Joined</div>\n          </div>\n          <div className=\"p-4 rounded-lg neumorphism-outset-heavy\">\n            <div className=\"text-2xl font-bold font-headline text-primary\">\n              {(waitlistState.total - waitlistState.joined).toLocaleString()}\n            </div>\n            <div className=\"text-xs text-muted-foreground\">Remaining</div>\n          </div>\n        </div>\n      </div>\n      <div className=\"flex flex-col items-center gap-4\">\n        <div className=\"relative group\">\n          <div className=\"absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-pink-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt\"></div>\n          <Button\n            size=\"lg\"\n            className=\"relative w-full max-w-xs rounded-full shadow-lg bg-background text-foreground\"\n            onClick={handleConnect}\n            disabled={isLoading}\n          >\n            {isLoading ? (\n              <Loader2 className=\"mr-2 h-5 w-5 animate-spin\" />\n            ) : (\n              <TwitterIcon className=\"mr-2 h-5 w-5\" />\n            )}\n            {isLoading ? \"Connecting...\" : \"Join Waitlist with X\"}\n          </Button>\n        </div>\n        <Button\n          onClick={handleConnect}\n          variant=\"link\"\n          className=\"text-muted-foreground\"\n          disabled={isLoading}\n        >\n          <LogIn className=\"mr-2 h-4 w-4\" />\n          Already registered? Login\n        </Button>\n      </div>\n    </div>\n  );\n};\n
