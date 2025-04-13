
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

interface ModelPerformanceProps {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
}

const ModelPerformance: React.FC<ModelPerformanceProps> = ({ 
  accuracy, 
  precision, 
  recall, 
  f1Score,
  confusionMatrix
}) => {
  const metricData = [
    { name: 'Accuracy', value: accuracy },
    { name: 'Precision', value: precision },
    { name: 'Recall', value: recall },
    { name: 'F1 Score', value: f1Score },
  ];

  const confusionData = [
    { name: 'True Negative', value: confusionMatrix[0][0], color: '#57CC99' },
    { name: 'False Positive', value: confusionMatrix[0][1], color: '#FFD6D6' },
    { name: 'False Negative', value: confusionMatrix[1][0], color: '#FFD6D6' },
    { name: 'True Positive', value: confusionMatrix[1][1], color: '#57CC99' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const accuracyPercentage = (accuracy * 100).toFixed(1);
  const precisionPercentage = (precision * 100).toFixed(1);
  const recallPercentage = (recall * 100).toFixed(1);
  const f1ScorePercentage = (f1Score * 100).toFixed(1);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Model Performance Metrics</CardTitle>
          <CardDescription>Key metrics for model evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metricData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`} />
                <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="flex flex-col items-center p-2 border rounded-md bg-slate-50">
              <span className="text-xs text-muted-foreground">Accuracy</span>
              <span className="text-lg font-bold">{accuracyPercentage}%</span>
            </div>
            <div className="flex flex-col items-center p-2 border rounded-md bg-slate-50">
              <span className="text-xs text-muted-foreground">Precision</span>
              <span className="text-lg font-bold">{precisionPercentage}%</span>
            </div>
            <div className="flex flex-col items-center p-2 border rounded-md bg-slate-50">
              <span className="text-xs text-muted-foreground">Recall</span>
              <span className="text-lg font-bold">{recallPercentage}%</span>
            </div>
            <div className="flex flex-col items-center p-2 border rounded-md bg-slate-50">
              <span className="text-xs text-muted-foreground">F1 Score</span>
              <span className="text-lg font-bold">{f1ScorePercentage}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Confusion Matrix</CardTitle>
          <CardDescription>Visualizing prediction accuracy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={confusionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {confusionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="border p-2 rounded-md flex flex-col text-sm">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-normal mr-2"></div>
                <span>True Negative: {confusionMatrix[0][0]}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-anomaly-light mr-2"></div>
                <span>False Positive: {confusionMatrix[0][1]}</span>
              </div>
            </div>
            <div className="border p-2 rounded-md flex flex-col text-sm">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-anomaly-light mr-2"></div>
                <span>False Negative: {confusionMatrix[1][0]}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-normal mr-2"></div>
                <span>True Positive: {confusionMatrix[1][1]}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelPerformance;
