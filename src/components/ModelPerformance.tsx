import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import AnomalyAnalysis from './AnomalyAnalysis';

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
  const total = confusionMatrix[0][0] + confusionMatrix[0][1] + confusionMatrix[1][0] + confusionMatrix[1][1];
  const truePositive = confusionMatrix[1][1];
  const trueNegative = confusionMatrix[0][0];
  const falsePositive = confusionMatrix[0][1];
  const falseNegative = confusionMatrix[1][0];

  const data = [
    { name: 'True Positive', value: truePositive, color: '#22c55e' },
    { name: 'True Negative', value: trueNegative, color: '#2563eb' },
    { name: 'False Positive', value: falsePositive, color: '#f87171' },
    { name: 'False Negative', value: falseNegative, color: '#facc15' },
  ];

  const sampleAnomaly = {
    type: "Unauthorized Access",
    user: "system_admin",
    timestamp: new Date().toISOString(),
    operation: "DELETE",
    severity: "high" as const
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Metrics</CardTitle>
          <CardDescription>Key metrics for model evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Accuracy</h4>
              <p className="text-2xl font-semibold">{(accuracy * 100).toFixed(1)}%</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Precision</h4>
              <p className="text-2xl font-semibold">{(precision * 100).toFixed(1)}%</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Recall</h4>
              <p className="text-2xl font-semibold">{(recall * 100).toFixed(1)}%</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">F1 Score</h4>
              <p className="text-2xl font-semibold">{(f1Score * 100).toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Confusion Matrix</CardTitle>
          <CardDescription>True vs predicted values</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
                {data.map((entry, index) => (
                  <Bar key={`bar-${index}`} dataKey="value" fill={entry.color} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Total samples: {total}
          </div>
        </CardContent>
      </Card>
      
      <div className="md:col-span-2">
        <AnomalyAnalysis anomalyData={sampleAnomaly} />
      </div>
    </div>
  );
};

export default ModelPerformance;
