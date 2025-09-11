
"use client";

import {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "@/supabase/config";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Loader2,
  User,
  Twitter as TwitterIcon,
} from "lucide-react";
import type { UserData } from "./types";

interface Step2ProfileProps {
  onNext: () => void;
  onBack: () => void;
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
}

export const Step2Profile: FC<Step2ProfileProps> = ({
  onNext,
  onBack,
  userData,
  updateUserData,
}) => {
  const [name, setName] = useState(userData.name);
  const [username, setUsername] = useState(userData.username);
  const [imagePreview, setImagePreview] = useState<string | null>(
    userData.profilePicture
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setName(userData.name);
    setUsername(userData.username);
    setImagePreview(userData.profilePicture);
  }, [userData]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Not Authenticated",
        description: "Please go back and connect your X account.",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }

    try {
      let finalImageUrl = userData.profilePicture;

      if (imageFile) {
        const filePath = `public/profile-pictures/${user.id}/${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars') // bucket name
          .upload(filePath, imageFile, { upsert: true });
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars') // bucket name
          .getPublicUrl(filePath);
        finalImageUrl = publicUrl;
      }

      const updatedData = {
        name,
        username,
        profile_picture: finalImageUrl,
      };

      const { error: dbError } = await supabase
        .from('users')
        .update(updatedData)
        .eq('id', user.id);

      if (dbError) throw dbError;

      updateUserData({ name, username, profilePicture: finalImageUrl });
      onNext();
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-full text-center">
      <h2 className="text-2xl font-headline font-semibold mb-2">
        Hello, {userData.name || "Pioneer"}!
      </h2>
      <p className="text-muted-foreground mb-8">Let's set up your identity.</p>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar
            className="w-32 h-32 neumorphism-outset-heavy p-1 cursor-pointer glowing-border"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <AvatarImage
                src={imagePreview ?? undefined}
                alt="Profile picture"
                className="z-10 object-cover"
              />
              <AvatarFallback className="bg-transparent z-10">
                <Camera className="w-12 h-12 text-primary/80" />
              </AvatarFallback>
            </div>
          </Avatar>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Portrait
          </Button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-left flex items-center gap-2">
              <User size={16} /> Full Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Jane Doe"
              className="neumorphism-inset-heavy"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-left flex items-center gap-2"
            >
              <TwitterIcon size={16} /> Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="e.g. @janedoe"
              className="neumorphism-inset-heavy"
            />
          </div>
        </div>
        <div className="flex justify-between w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="neumorphism-outset-heavy"
            disabled={isUploading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            className="neumorphism-outset-heavy bg-primary text-primary-foreground"
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Next"
            )}
            {isUploading ? "" : <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
};
