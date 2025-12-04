import { useMemo } from 'react';
import {
  Eye,
  MousePointerClick,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { ContentItem, ContentAnalytics as ContentAnalyticsType } from '@/stores/contentStore';
import { cn } from '@/lib/utils';

interface ContentAnalyticsProps {
  content: ContentItem;
  analytics: ContentAnalyticsType;
}

export function ContentAnalytics({ content, analytics }: ContentAnalyticsProps) {
  const engagementRate = analytics.views > 0 
    ? ((analytics.clicks / analytics.views) * 100).toFixed(1) 
    : '0';

  const avgTimeFormatted = useMemo(() => {
    const mins = Math.floor(analytics.avgTimeSpent / 60);
    const secs = analytics.avgTimeSpent % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }, [analytics.avgTimeSpent]);

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-500';
    if (trend < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Eye className="h-5 w-5 text-blue-500" />
              {getTrendIcon(analytics.viewsTrend)}
            </div>
            <p className="text-2xl font-bold mt-2">{analytics.views.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Views</p>
            <p className={cn('text-xs mt-1', getTrendColor(analytics.viewsTrend))}>
              {analytics.viewsTrend > 0 ? '+' : ''}{analytics.viewsTrend}% vs last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <MousePointerClick className="h-5 w-5 text-purple-500" />
              {getTrendIcon(analytics.clicksTrend)}
            </div>
            <p className="text-2xl font-bold mt-2">{analytics.clicks.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Clicks</p>
            <p className={cn('text-xs mt-1', getTrendColor(analytics.clicksTrend))}>
              {analytics.clicksTrend > 0 ? '+' : ''}{analytics.clicksTrend}% vs last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <Badge variant={Number(engagementRate) > 5 ? 'default' : 'secondary'}>
                {Number(engagementRate) > 5 ? 'Good' : 'Low'}
              </Badge>
            </div>
            <p className="text-2xl font-bold mt-2">{engagementRate}%</p>
            <p className="text-xs text-muted-foreground">Engagement Rate</p>
            <Progress value={Math.min(Number(engagementRate) * 5, 100)} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{avgTimeFormatted}</p>
            <p className="text-xs text-muted-foreground">Avg. Time Spent</p>
            <p className="text-xs text-muted-foreground mt-1">
              per session
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Views Over Time</CardTitle>
            <CardDescription>Last 7 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.dailyStats}>
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en', { weekday: 'short' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--primary))"
                    fill="url(#viewsGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Clicks by Day</CardTitle>
            <CardDescription>User interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en', { weekday: 'short' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="clicks" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Content Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{content.createdAt}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Published</p>
              <p className="font-medium">{content.publishDate || 'Not published'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">{content.updatedAt}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Author</p>
              <p className="font-medium">{content.author}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
