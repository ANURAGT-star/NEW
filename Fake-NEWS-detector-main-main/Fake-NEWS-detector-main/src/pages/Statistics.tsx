import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  LabelList
} from "recharts";
import { databaseService, FactCheckResult } from "@/services/databaseService";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const Statistics: React.FC = () => {
  const history = databaseService.getHistory();
  
  const prepareRatingData = () => {
    const ratings: Record<string, number> = { "True": 0, "False": 0, "Mixed": 0, "Unknown": 0 };
    
    history.forEach(item => {
      const rating = item.result.rating || "Unknown";
      ratings[rating] = (ratings[rating] || 0) + 1;
    });
    
    return Object.entries(ratings).map(([rating, count]) => ({
      name: rating,
      value: count || 0.1
    }));
  };
  
  const prepareConfidenceData = () => {
    return history.map((item, index) => ({
      name: `Check ${index + 1}`,
      confidence: Math.round(item.result.confidence * 100)
    })).slice(-10);
  };
  
  const prepareTimelineData = () => {
    const today = new Date();
    const last7Days: Record<string, number> = {};
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      last7Days[dateStr] = 0;
    }
    
    history.forEach(item => {
      const date = new Date(item.timestamp);
      const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (last7Days[dateStr] !== undefined) {
        last7Days[dateStr]++;
      }
    });
    
    return Object.entries(last7Days).map(([date, count]) => ({
      date,
      checks: count
    }));
  };
  
  const ratingData = prepareRatingData();
  const confidenceData = prepareConfidenceData();
  const timelineData = prepareTimelineData();
  
  const totalChecks = history.length;
  const avgConfidence = history.length > 0 
    ? Math.round(history.reduce((sum, item) => sum + item.result.confidence, 0) / history.length * 100) 
    : 0;
  
  const ratingCounts = history.reduce((counts: Record<string, number>, item) => {
    const rating = item.result.rating || "Unknown";
    counts[rating] = (counts[rating] || 0) + 1;
    return counts;
  }, {});
  
  const mostCommonRating = Object.entries(ratingCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
  
  const COLORS = {
    True: "#4CAF50",
    False: "#F44336",
    Mixed: "#FFC107",
    Unknown: "#9E9E9E"
  };
  
  const ratingColors = ratingData.map(entry => COLORS[entry.name as keyof typeof COLORS] || "#9E9E9E");

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value } = props;
    
    if (percent < 0.01) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#333333"
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="14"
        fontWeight="bold"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Fact Check Statistics</h1>
        <p className="text-muted-foreground">
          Visualize your fact checking activity and outcomes
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Fact Checks</CardTitle>
            <CardDescription>All-time checks performed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalChecks}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Average Confidence</CardTitle>
            <CardDescription>Across all fact checks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{avgConfidence}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Most Common Result</CardTitle>
            <CardDescription>Most frequent rating</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{mostCommonRating}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown of fact check results</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                <Pie
                  data={ratingData}
                  cx="50%"
                  cy="40%"
                  labelLine={true}
                  outerRadius={100}
                  innerRadius={0}
                  paddingAngle={2}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                  strokeWidth={2}
                  stroke="#ffffff"
                >
                  {ratingData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={ratingColors[index]} 
                      stroke="#ffffff" 
                      strokeWidth={2} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const actualValue = history.filter(item => 
                        (item.result.rating || "Unknown") === data.name
                      ).length;
                      
                      return (
                        <div className="bg-background border border-border rounded p-3 shadow-md">
                          <p className="font-medium text-base">{`${data.name}: ${actualValue} checks`}</p>
                          <p className="text-sm text-muted-foreground">
                            {actualValue === 0 
                              ? "No checks with this rating" 
                              : `${(actualValue / history.length * 100).toFixed(1)}% of total`}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: 20 }}
                  formatter={(value) => <span className="text-sm font-medium">{value}</span>}
                  iconType="circle"
                  iconSize={12}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Confidence Levels</CardTitle>
            <CardDescription>Confidence scores from recent checks</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={confidenceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="confidence" name="Confidence" fill="#1976D2" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Fact Checks Timeline</CardTitle>
            <CardDescription>Number of checks performed in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timelineData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="checks" 
                  stroke="#1976D2" 
                  activeDot={{ r: 8 }} 
                  name="Fact Checks" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
