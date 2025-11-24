import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from '@/lib/auth-context';
import { Loader2, Building2, User, Mail, Lock, Phone, KeyRound } from 'lucide-react';

// Consumer Schema
const consumerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  uniqueCode: z.string().min(4, "Enter your unique code"),
  email: z.string().email("Invalid email address"),
  whatsapp: z.string().min(10, "Invalid phone number"),
  password: z.string().min(8, "Password must be exactly 8 digits").max(8, "Password must be exactly 8 digits").regex(/^\d+$/, "Password must be numbers only"),
});

// Business Schema
const businessSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  email: z.string().email("Invalid business email"),
  category: z.string().min(2, "Category is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("consumer");
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  
  // Extract query param for default tab if needed, but wouter usage is a bit manual for query params
  // skipping for simplicity, defaulting to state

  const consumerForm = useForm<z.infer<typeof consumerSchema>>({
    resolver: zodResolver(consumerSchema),
    defaultValues: {
      username: "",
      uniqueCode: "",
      email: "",
      whatsapp: "",
      password: "",
    },
  });

  const businessForm = useForm<z.infer<typeof businessSchema>>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName: "",
      email: "",
      category: "",
      password: "",
    },
  });

  const onConsumerSubmit = (data: z.infer<typeof consumerSchema>) => {
    login('consumer', data);
  };

  const onBusinessSubmit = (data: z.infer<typeof businessSchema>) => {
    login('business', data);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-lg border-border shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-primary">Welcome to Syntera</CardTitle>
          <CardDescription>Sign in or create an account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="consumer" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="consumer" className="gap-2">
                <User className="w-4 h-4" /> Consumer
              </TabsTrigger>
              <TabsTrigger value="business" className="gap-2">
                <Building2 className="w-4 h-4" /> Business
              </TabsTrigger>
            </TabsList>

            <TabsContent value="consumer">
              <Form {...consumerForm}>
                <form onSubmit={consumerForm.handleSubmit(onConsumerSubmit)} className="space-y-4">
                  <FormField
                    control={consumerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="johndoe" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={consumerForm.control}
                      name="uniqueCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unique Code</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="XYZ-123" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={consumerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>8-Digit PIN</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" type="password" placeholder="12345678" maxLength={8} {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={consumerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" type="email" placeholder="john@example.com" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={consumerForm.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" type="tel" placeholder="+1 234 567 890" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-11 text-lg mt-4">
                    Sign In as Consumer
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="business">
               <Form {...businessForm}>
                <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-4">
                  <FormField
                    control={businessForm.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="Acme Corp" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={businessForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Category</FormLabel>
                        <FormControl>
                          <Input placeholder="Retail, Tech, Services..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={businessForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Email</FormLabel>
                        <FormControl>
                           <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" type="email" placeholder="contact@business.com" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={businessForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" type="password" placeholder="••••••••" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-11 text-lg mt-4">
                    Sign In as Business
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
