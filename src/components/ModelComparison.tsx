
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface ModelComparisonProps {
  modelResults: {
    name: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    auc: number;
    color: string;
  }[];
}

const ModelComparison: React.FC<ModelComparisonProps> = ({ modelResults }) => {
  // Create data for the radar chart
  // Restructure the radar data to work with the RadarChart component
  const radarData = [];
  
  // Create metrics as separate keys
  const metrics = ['accuracy', 'precision', 'recall', 'f1', 'auc'];
  
  metrics.forEach(metric => {
    const dataPoint: Record<string, string | number> = { subject: metric.charAt(0).toUpperCase() + metric.slice(1) };
    
    modelResults.forEach(model => {
      // Add each model's performance to this metric datapoint
      // Use type assertion to ensure TypeScript knows this is a number
      const value = model[metric as keyof typeof model] as number;
      dataPoint[model.name] = value * 100;
    });
    
    radarData.push(dataPoint);
  });

  // Prepare data for the metrics comparison
  const createMetricData = (metric: string) => {
    return modelResults.map(model => ({
      name: model.name,
      value: model[metric as keyof typeof model] as number,
      color: model.color
    }));
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg">Model Algorithm Comparison</CardTitle>
        <CardDescription>Compare performance across different algorithms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[300px]">
            <h4 className="mb-2 text-sm font-medium">Algorithm Performance by Metric</h4>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} width={730} height={250} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                {modelResults.map((model) => (
                  <Radar 
                    key={model.name} 
                    name={model.name} 
                    dataKey={model.name} 
                    stroke={model.color} 
                    fill={model.color} 
                    fillOpacity={0.2} 
                  />
                ))}
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-[300px]">
            <h4 className="mb-2 text-sm font-medium">Accuracy Comparison</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={createMetricData('accuracy')}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(2)}%`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563EB" 
                  dot={{ strokeWidth: 2, r: 4 }} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="mb-4 text-sm font-medium">Performance Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {modelResults.map(model => (
              <div 
                key={model.name} 
                className="border rounded-md p-3 bg-slate-50"
                style={{ borderLeft: `4px solid ${model.color}` }}
              >
                <h5 className="font-medium text-sm">{model.name}</h5>
                <div className="text-xs space-y-1 mt-2">
                  <p>Accuracy: <span className="font-medium">{(model.accuracy * 100).toFixed(1)}%</span></p>
                  <p>F1 Score: <span className="font-medium">{(model.f1 * 100).toFixed(1)}%</span></p>
                  <p>AUC: <span className="font-medium">{(model.auc * 100).toFixed(1)}%</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelComparison;
