import { TrendingUp, TrendingDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import useFetch from "@/hooks/useFetchData"
import { useMemo } from "react"

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--primary)",
  },
  drivers: {
    label: "Drivers",
    color: "var(--blue)",
  },
} satisfies ChartConfig

export function ChartLineDots() {
  const { data, loading, error } = useFetch('/auth/stats', {
    immediate: true
  });

  // Calculate trends and totals
  const stats = useMemo(() => {
    if (!data?.data || data.data.length < 2) {
      return {
        userTrend: 0,
        driverTrend: 0,
        totalUsers: 0,
        totalDrivers: 0,
        dateRange: ''
      };
    }

    const chartData = data.data;
    const lastMonth = chartData[chartData.length - 1];
    const previousMonth = chartData[chartData.length - 2];
    
    // Calculate user trend
    let userTrend = 0;
    if (previousMonth.users > 0) {
      userTrend = ((lastMonth.users - previousMonth.users) / previousMonth.users) * 100;
    } else if (lastMonth.users > 0) {
      userTrend = 100;
    }
    
    // Calculate driver trend
    let driverTrend = 0;
    if (previousMonth.drivers > 0) {
      driverTrend = ((lastMonth.drivers - previousMonth.drivers) / previousMonth.drivers) * 100;
    } else if (lastMonth.drivers > 0) {
      driverTrend = 100;
    }

    // Calculate totals
    const totalUsers = chartData.reduce((sum, item) => sum + item.users, 0);
    const totalDrivers = chartData.reduce((sum, item) => sum + item.drivers, 0);
    
    // Generate date range
    const currentDate = new Date();
    const dateRange = `${chartData[0]?.month || ''} - ${chartData[chartData.length - 1]?.month || ''} ${currentDate.getFullYear()}`;

    return {
      userTrend: parseFloat(userTrend.toFixed(1)),
      driverTrend: parseFloat(driverTrend.toFixed(1)),
      totalUsers,
      totalDrivers,
      dateRange
    };
  }, [data]);

  // Loading state with skeleton
  if (loading) {
    return (
      <Card className="flex-1">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardFooter>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>New Registrations by Role</CardTitle>
          <CardDescription>Error loading data</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-destructive">{error.message || 'Failed to load chart data'}</p>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!data?.data || data.data.length === 0) {
    return (
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>New Registrations by Role</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No registration data found for the last 6 months</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>New Registrations by Role</CardTitle>
        <CardDescription>{stats.dateRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data.data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Line
              dataKey="users"
              type="natural"
              stroke="var(--color-users)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-users)",
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="drivers"
              type="natural"
              stroke="var(--color-drivers)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-drivers)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2 leading-none font-medium items-center">
            <span 
              className="inline-block w-3 h-3 rounded-full" 
              style={{backgroundColor: "var(--primary)"}}
            />
            <span>Users: {stats.totalUsers} total</span>
            {stats.userTrend !== 0 && (
              <span className="flex items-center gap-1 ml-2">
                {stats.userTrend > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">+{stats.userTrend}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-red-600">{stats.userTrend}%</span>
                  </>
                )}
              </span>
            )}
          </div>
          <div className="flex gap-2 leading-none font-medium items-center">
            <span 
              className="inline-block w-3 h-3 rounded-full" 
              style={{backgroundColor: "var(--blue)"}}
            />
            <span>Drivers: {stats.totalDrivers} total</span>
            {stats.driverTrend !== 0 && (
              <span className="flex items-center gap-1 ml-2">
                {stats.driverTrend > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">+{stats.driverTrend}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-red-600">{stats.driverTrend}%</span>
                  </>
                )}
              </span>
            )}
          </div>
        </div>
        <div className="text-muted-foreground leading-none mt-2">
          Showing new registrations for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}