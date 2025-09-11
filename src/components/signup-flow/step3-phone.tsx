
"use client";

import { FC, FormEvent, useState } from "react";
import { supabase } from "@/supabase/config";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Phone,
} from "lucide-react";
import type { UserData } from "./types";

interface Step3PhoneProps {
  onNext: () => void;
  onBack: () => void;
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
}

export const Step3Phone: FC<Step3PhoneProps> = ({
  onNext,
  onBack,
  userData,
  updateUserData,
}) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast({ title: "Phone number is required.", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ phone: phone });
      if (error) throw error;

      const { error: otpError } = await supabase.auth.signInWithOtp({ phone });
      if (otpError) throw otpError;

      setIsOtpSent(true);
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${phone}.`,
      });
    } catch (error: any) {
      console.error("SMS not sent error:", error);
      toast({
        title: "Failed to send OTP",
        description:
          error.message || "Please check the phone number and try again.",
        variant: "destructive",
      });
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast({ title: "OTP is required.", variant: "destructive" });
      return;
    }

    setIsVerifying(true);
    try {
      const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
      if (verifyError) throw verifyError;
      if (!session) throw new Error("Verification failed, no session returned.");

      const user = session.user;
      if (!user) throw new Error("Not authenticated!");

      const { error: dbError } = await supabase
        .from('users')
        .update({ phone: user.phone })
        .eq('id', user.id);
      
      if (dbError) throw dbError;

      updateUserData({ phone });
      toast({
        title: "Phone number verified!",
        className: "bg-accent text-accent-foreground",
      });
      onNext();
    } catch (error: any) {
      console.error("Phone verification error:", error);
      toast({
        title: "Invalid OTP",
        description: error.message || "The code you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-full text-center">
      <h2 className="text-2xl font-headline font-semibold mb-2">
        Verify Your Phone
      </h2>
      <p className="text-muted-foreground mb-8">For security and authenticity.</p>
      {!isOtpSent ? (
        <form onSubmit={handleSendOtp} className="w-full max-w-sm space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-left flex items-center gap-2">
              <Phone size={16} /> Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+1 234 567 890"
              className="neumorphism-inset-heavy"
            />
          </div>
          <div className="flex justify-between w-full">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="neumorphism-outset-heavy"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              type="submit"
              className="neumorphism-outset-heavy bg-primary text-primary-foreground"
            >
              Send Code
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="w-full max-w-sm space-y-6">
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to {phone}.
          </p>
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="neumorphism-inset-heavy"
            />
          </div>
          <div className="flex justify-between w-full">
            <Button type="button" variant="ghost" onClick={() => setIsOtpSent(false)}>
              Change Number
            </Button>
            <Button
              type="submit"
              className="neumorphism-outset-heavy bg-primary text-primary-foreground"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
