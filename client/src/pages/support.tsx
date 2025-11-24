import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'agent';
  createdAt: Date;
}

export default function SupportPage() {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await fetch(`/api/messages/${user.id}`);
      const data = await res.json();
      return data.map((msg: any) => ({
        ...msg,
        createdAt: new Date(msg.createdAt)
      }));
    },
    enabled: !!user?.id,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          text,
          sender: 'user',
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', user?.id] });
      
      setTimeout(() => {
        fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            text: "Thank you for your message. An agent is reviewing your request and will reply shortly.",
            sender: 'agent',
          }),
        }).then(() => {
          queryClient.invalidateQueries({ queryKey: ['messages', user?.id] });
        });
      }, 1500);
    },
  });

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user) return;
    sendMessageMutation.mutate(inputValue);
    setInputValue("");
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (user?.id && messages.length === 0) {
      fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          text: "Hello! Welcome to Syntera 24/7 Support. How can I help you today?",
          sender: 'agent',
        }),
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ['messages', user.id] });
      });
    }
  }, [user?.id]);

  return (
    <div className="max-w-4xl mx-auto h-[80vh]">
      <Card className="h-full flex flex-col border-border shadow-lg overflow-hidden">
        <CardHeader className="border-b bg-primary/5 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full absolute -bottom-1 -right-1 border-2 border-background"></div>
              <Avatar>
                <AvatarFallback>CS</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <CardTitle className="text-lg">Live Support</CardTitle>
              <p className="text-xs text-muted-foreground">Online • Typically replies in 2m</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="w-8 h-8">
                      {msg.sender === 'user' ? (
                        <AvatarFallback><UserIcon className="w-4 h-4" /></AvatarFallback>
                      ) : (
                         <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="w-4 h-4" /></AvatarFallback>
                      )}
                    </Avatar>
                    <div
                      className={`p-3 rounded-2xl text-sm ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-muted text-foreground rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                      <div className={`text-[10px] mt-1 opacity-70 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-background">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={!user}
              />
              <Button type="submit" size="icon" disabled={!inputValue.trim() || !user}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
