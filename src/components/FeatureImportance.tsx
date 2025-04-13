
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FeatureImportanceProps {
  features: { name: string; importance: number }[];
}

const FeatureImportance: React.FC<FeatureImportanceProps> = ({ features }) => {
  const [sortMethod, setSortMethod] = useState<'importance' | 'alphabetical'>('importance');
  
  const sortedFeatures = [...features].sort((a, b) => {
    if (sortMethod === 'importance') {
      return b.importance - a.importance;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  // Only show top 10 features when sorted by importance
  const displayFeatures = sortMethod === 'importance' 
    ? sortedFeatures.slice(0, 10) 
    : sortedFeatures;

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Feature Importance</CardTitle>
          <CardDescription>
            {sortMethod === 'importance' 
              ? 'Top 10 features ranked by importance' 
              : 'All features in alphabetical order'}
          </CardDescription>
        </div>
        <Select
          value={sortMethod}
          onValueChange={(value) => setSortMethod(value as 'importance' | 'alphabetical')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="importance">Sort by importance</SelectItem>
            <SelectItem value="alphabetical">Sort alphabetically</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={displayFeatures}
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.1} />
              <XAxis type="number" domain={[0, Math.max(...features.map(f => f.importance)) * 1.1]} />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip 
                formatter={(value) => `${(Number(value) * 100).toFixed(2)}%`} 
                labelFormatter={(label) => `Feature: ${label}`}
              />
              <Bar dataKey="importance">
                {displayFeatures.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={sortedFeatures.indexOf(entry) < 3 ? '#2563EB' : '#6366F1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            {sortMethod === 'importance' 
              ? 'Features with higher importance have a greater impact on model predictions.' 
              : 'Use feature importance to identify which variables are most predictive of anomalies.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureImportance;
