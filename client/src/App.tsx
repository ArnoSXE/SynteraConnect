import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";
import LoadingScreen from "@/pages/loading";
import Home from "@/pages/home";
import AuthPage from "@/pages/auth";
import SupportPage from "@/pages/support";
import FeedbackPage from "@/pages/feedback";
import Dashboard from "@/pages/dashboard";

function Router() {
  const [location] = useLocation();

  // Very simple splash screen logic: 
  // If we are at root '/' and it's the first load (handled by LoadingScreen component directing to real home), 
  // we show loading. 
  // Actually, the prompt asked for a loading screen *as soon as we open the app*.
  // So I'll mount a separate route for it or handle it conditionally.
  // Let's use a separate route '/splash' and default to it, OR just have a conditional render.
  
  // Better approach:
  // The user said "loading screen... loads the home page".
  // I'll make the default route '/' render the LoadingScreen which then redirects to '/home' (landing).
  // This simulates the app opening experience.
  
  return (
    <Layout>
      <Switch>
        <Route path="/" component={LoadingScreen} />
        <Route path="/home" component={Home} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/support" component={SupportPage} />
        <Route path="/feedback" component={FeedbackPage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
