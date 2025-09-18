"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
    id: string;
    title: string;
    body: string;
    created_at: string;
}

interface InboxPanelProps {
  userId: string;
}

export function InboxPanel({ userId }: InboxPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      // This is a simplified example. You'd likely have a 'messages' table
      // with a foreign key to the 'users' table.
      // For now, let's assume a generic messages table.
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        // .eq('recipient_id', userId) // You would filter by the user ID
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
      }
      setLoading(false);
    };

    fetchMessages();
  }, [userId]);

  return (
    <Card className="neumorphism-outset-heavy">
      <CardHeader>
        <CardTitle className="font-headline">Inbox</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-muted-foreground">You have no new messages.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="p-2 border-b">
                <h4 className="font-semibold">{msg.title}</h4>
                <p className="text-sm text-muted-foreground">{msg.body}</p>
                <p className="text-xs text-right text-muted-foreground">
                  {new Date(msg.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
