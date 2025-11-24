import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Send, AlertTriangle, ThumbsUp } from 'lucide-react';

const feedbackSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  type: z.enum(["complaint", "suggestion", "other"]),
  message: z.string().min(20, "Please provide more detail (at least 20 characters)"),
  email: z.string().email("Please enter a valid email for follow-up"),
});

export default function FeedbackPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      subject: "",
      type: "complaint",
      message: "",
      email: "",
    },
  });

  const onSubmit = (data: z.infer<typeof feedbackSchema>) => {
    console.log("Feedback sent:", data);
    toast({
      title: "Feedback Sent",
      description: `We've sent your ${data.type} to the company email. We'll get back to you at ${data.email}.`,
    });
    form.reset();
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="border-border shadow-lg">
        <CardHeader>
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl">Feedback & Complaints</CardTitle>
          <CardDescription>
            Your voice matters. Directly message the registered company. 
            All complaints are forwarded immediately to the company's priority inbox.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <div className="flex gap-4">
                      {['complaint', 'suggestion', 'other'].map((type) => (
                        <Button
                          key={type}
                          type="button"
                          variant={field.value === type ? "default" : "outline"}
                          className="capitalize flex-1"
                          onClick={() => field.onChange(type)}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief summary of the issue..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Where should we reply?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your experience in detail..." 
                        className="min-h-[150px] resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full text-lg h-12 gap-2">
                <Send className="w-4 h-4" /> Send to Company
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
