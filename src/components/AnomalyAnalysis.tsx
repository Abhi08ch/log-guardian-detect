
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AnomalyAnalysisProps {
  anomalyData: {
    type: string;
    user: string;
    timestamp: string;
    operation: string;
    severity: 'high' | 'medium' | 'low';
  };
}

const AnomalyAnalysis: React.FC<AnomalyAnalysisProps> = ({ anomalyData }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const analyzeAnomaly = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to use the analysis feature.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a security analyst specialized in database anomaly detection. Provide concise, actionable insights about anomalies.'
            },
            {
              role: 'user',
              content: `Analyze this database anomaly:
                User: ${anomalyData.user}
                Operation Type: ${anomalyData.operation}
                Timestamp: ${anomalyData.timestamp}
                Severity: ${anomalyData.severity}
                
                Provide a brief analysis of the risk and recommended actions.`
            }
          ],
          temperature: 0.2,
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze anomaly');
      }

      const data = await response.json();
      setAnalysis(data.choices[0].message.content);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the anomaly. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="h-5 w-5 text-chart-blue" />
          LLM Analysis
        </CardTitle>
        <CardDescription>AI-powered anomaly analysis and insights</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <input
            type="password"
            placeholder="Enter Perplexity API Key"
            className="w-full px-3 py-2 border rounded-md"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Your API key is required for analysis. It's only stored in your browser's memory.
          </p>
        </div>

        <Button 
          onClick={analyzeAnomaly} 
          disabled={isAnalyzing || !apiKey}
          className="w-full"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Anomaly'}
        </Button>

        {analysis && (
          <div className="mt-4 p-4 bg-slate-50 rounded-md">
            <h4 className="font-medium mb-2">Analysis Results:</h4>
            <p className="text-sm whitespace-pre-line">{analysis}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnomalyAnalysis;
