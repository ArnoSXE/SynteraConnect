import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, MessageSquare, Send, Home, LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import logoImage from '@assets/generated_images/minimalist_geometric_purple_logo_for_syntera.png';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const navItems = [
    { label: 'Home', path: user ? '/dashboard' : '/', icon: Home },
    { label: 'Support', path: '/support', icon: MessageSquare },
    { label: 'Feedback', path: '/feedback', icon: Send },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={user ? '/dashboard' : '/'}>
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={logoImage} alt="Syntera" className="h-8 w-8 object-contain" />
              <span className="font-bold text-xl tracking-tight">Syntera</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${location === item.path ? 'text-primary' : 'text-muted-foreground'}`}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </a>
              </Link>
            ))}
            
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {user ? (
              <Button variant="outline" onClick={logout} className="gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            ) : (
              <Link href="/auth">
                <Button className="gap-2">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile Nav */}
          <div className="flex md:hidden items-center gap-2">
             <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-8 mt-8">
                  <div className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <Link key={item.path} href={item.path}>
                        <a className={`text-lg font-medium p-2 rounded-md transition-colors hover:bg-muted flex items-center gap-3 ${location === item.path ? 'text-primary bg-primary/10' : 'text-foreground'}`}>
                           <item.icon className="w-5 h-5" />
                          {item.label}
                        </a>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    {user ? (
                       <div className="flex flex-col gap-4">
                         <div className="flex items-center gap-3 px-2">
                           <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                             {user.name[0]}
                           </div>
                           <div>
                             <p className="font-medium">{user.name}</p>
                             <p className="text-xs text-muted-foreground capitalize">{user.type} Account</p>
                           </div>
                         </div>
                         <Button variant="destructive" onClick={logout} className="w-full justify-start gap-2">
                           <LogOut className="w-4 h-4" /> Sign Out
                         </Button>
                       </div>
                    ) : (
                      <Link href="/auth">
                        <Button className="w-full text-lg py-6">Sign In / Sign Up</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
