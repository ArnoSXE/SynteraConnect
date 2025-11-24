import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, MessageCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import logoImage from '@assets/generated_images/minimalist_geometric_purple_logo_for_syntera.png';

export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 max-w-3xl"
        >
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Next Gen CRM
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Bridging <span className="text-primary">Business</span> & <span className="text-purple-400">Consumers</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Syntera is the ultimate gateway for seamless customer relationships. 
            Experience 24/7 support, instant feedback loops, and effortless management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/auth?type=consumer">
              <Button size="lg" className="text-lg px-8 h-14 rounded-full shadow-lg shadow-primary/20">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth?type=business">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-full">
                For Business
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: MessageCircle,
            title: "24/7 Live Support",
            desc: "Instant connection between customers and support teams anytime, anywhere."
          },
          {
            icon: Zap,
            title: "Instant Feedback",
            desc: "Direct line of communication for complaints and suggestions that actually reach the company."
          },
          {
            icon: ShieldCheck,
            title: "Secure Data",
            desc: "Enterprise-grade security for both business and consumer data protection."
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="rounded-3xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 p-8 md:p-12 text-center">
        <div className="flex flex-col items-center gap-6">
           <img src={logoImage} alt="Syntera" className="w-16 h-16 object-contain opacity-80" />
           <h2 className="text-3xl font-bold">Ready to transform your experience?</h2>
           <p className="text-muted-foreground max-w-lg">Join thousands of users and businesses already using Syntera to build better relationships.</p>
           <Link href="/auth">
             <Button size="lg" className="rounded-full">Join Syntera Today</Button>
           </Link>
        </div>
      </section>
    </div>
  );
}
