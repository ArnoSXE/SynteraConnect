import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, TrendingUp, MessageSquare, Clock, DollarSign, ArrowUpRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const isBusiness = user.type === 'business';
  const isSales = isBusiness && user.category === 'Sales';

  const { data: salesData } = useQuery({
    queryKey: ['sales', user.id],
    queryFn: async () => {
      const res = await fetch(`/api/sales/${user.id}/latest`);
      return res.json();
    },
    enabled: isSales,
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}. Here's what's happening today.</p>
        </div>
        <Button>Download Report</Button>
      </div>

      {isSales && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" /> Sales Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-background border border-border">
                <p className="text-sm text-muted-foreground">Daily Revenue</p>
                <h3 className="text-2xl font-bold text-primary">
                  ${salesData ? (salesData.revenue / 100).toFixed(2) : '12,450'}
                </h3>
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> +15% vs yesterday
                </span>
              </div>
              <div className="p-4 rounded-lg bg-background border border-border">
                <p className="text-sm text-muted-foreground">Total Conversions</p>
                <h3 className="text-2xl font-bold">{salesData?.conversions || 145}</h3>
                <span className="text-xs text-muted-foreground">2.4% conversion rate</span>
              </div>
              <div className="p-4 rounded-lg bg-background border border-border">
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <h3 className="text-2xl font-bold">
                  ${salesData ? (salesData.avgOrderValue / 100).toFixed(2) : '85.20'}
                </h3>
                <span className="text-xs text-green-600 flex items-center gap-1">
                   <ArrowUpRight className="w-3 h-3" /> +5% vs last week
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: isBusiness ? "Total Customers" : "Active Tickets", value: isBusiness ? "1,234" : "2", icon: Users },
          { label: isBusiness ? "Resolution Rate" : "Points Earned", value: isBusiness ? "94%" : "450", icon: TrendingUp },
          { label: "New Messages", value: "12", icon: MessageSquare },
          { label: "Avg. Response", value: "2m", icon: Clock },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md border border-dashed">
               <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
               <span className="ml-4 text-muted-foreground">Activity Chart Visualization</span>
             </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent {isBusiness ? "Inquiries" : "Updates"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {isBusiness ? `Customer #${1000+i}` : `Ticket #${200+i}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isBusiness ? "inquiry@example.com" : "Your issue has been resolved."}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">Just now</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
