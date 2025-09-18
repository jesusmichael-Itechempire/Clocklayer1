"use client";

import { useState } from 'react';
import { supabase } from '@/supabase/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { EditProfileModal } from './edit-profile-modal';
import { UserProfile } from '@/app/dashboard/page'; // Reuse the type
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserProfileCardProps {
  user: UserProfile;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <Card className="neumorphism-outset-heavy">
        <CardHeader>
          <CardTitle className="font-headline">Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 neumorphism-outset-heavy p-1">
            <AvatarImage src={user.profile_picture} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-muted-foreground">@{user.username}</p>
          <div className="mt-4 flex justify-center gap-2">
            <Button onClick={() => setEditModalOpen(true)}>Edit Profile</Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </CardContent>
      </Card>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={user}
      />
    </>
  );
}
