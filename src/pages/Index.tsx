
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AlertTriangle, Award, BarChart, Download, FileText, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import DataUploader from '@/components/DataUploader';
import ModelPerformance from '@/components/ModelPerformance';
import FeatureImportance from '@/components/FeatureImportance';
import HyperparameterTuning from '@/components/HyperparameterTuning';
import ModelComparison from '@/components/ModelComparison';
import { 
  calculateMetricsFromMatrix, 
  sampleConfusionMatrix, 
  sampleFeatureImportance,
  sampleModelResults,
  simulateModelTraining,
  trainingHistory 
} from '@/utils/modelUtils';

const initialMetrics = calculateMetricsFromMatrix(sampleConfusionMatrix);

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trainData, setTrainData] = useState<any>(null);
  const [testData, setTestData] = useState<any>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [modelMetrics, setModelMetrics] = useState({
    accuracy: initialMetrics.accuracy,
    precision: initialMetrics.precision,
    recall: initialMetrics.recall,
    f1Score: initialMetrics.f1Score,
    confusionMatrix: sampleConfusionMatrix,
  });
  const [featureImportance, setFeatureImportance] = useState(sampleFeatureImportance);

  const handleDataUpload = (data: any, type: 'train' | 'test') => {
    if (type === 'train') {
      setTrainData(data);
    } else {
      setTestData(data);
    }
  };

  const handleTrainModel = async (config: any) => {
    if (!trainData) {
      toast({
        title: "Missing training data",
        description: "Please upload training data first",
        variant: "destructive"
      });
      return;
    }

    setIsTraining(true);
    
    try {
      const result = await simulateModelTraining(config);
      
      setModelMetrics({
        accuracy: result.accuracy,
        precision: result.precision,
        recall: result.recall,
        f1Score: result.f1Score,
        confusionMatrix: result.confusionMatrix
      });
      
      setFeatureImportance(result.featureImportance);
      
      toast({
        title: "Model trained successfully",
        description: `Achieved ${(result.accuracy * 100).toFixed(1)}% accuracy`,
      });
      
      setActiveTab('results');
    } catch (error) {
      toast({
        title: "Training failed",
        description: "An error occurred during model training",
        variant: "destructive"
      });
      console.error("Training error:", error);
    } finally {
      setIsTraining(false);
    }
  };

  const bestPerformingModel = sampleModelResults.reduce((prev, current) => 
    (prev.accuracy > current.accuracy) ? prev : current
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart className="h-6 w-6 text-chart-blue" />
            <h1 className="text-xl font-bold">Log Guardian - Anomaly Detection</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-chart-blue/10 text-chart-blue border-chart-blue/20">
              <Award className="h-3 w-3 mr-1" />
              {(bestPerformingModel.accuracy * 100).toFixed(1)}% Best Accuracy
            </Badge>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-xl mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Anomaly Detection Overview</CardTitle>
                  <CardDescription>Current performance and improvement opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trainingHistory}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="epoch" />
                        <YAxis yAxisId="left" domain={[0.6, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 0.5]} />
                        <Tooltip formatter={(value) => typeof value === 'number' ? value.toFixed(2) : value} />
                        <Legend />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="accuracy" 
                          name="Accuracy"
                          stroke="#2563EB" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="loss" 
                          name="Loss"
                          stroke="#EF4444" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div className="border p-4 rounded-lg flex flex-col items-center">
                      <span className="text-xs text-muted-foreground">Model Type</span>
                      <span className="font-semibold mt-1">Random Forest</span>
                    </div>
                    <div className="border p-4 rounded-lg flex flex-col items-center bg-normal/10">
                      <span className="text-xs text-muted-foreground">Accuracy</span>
                      <span className="font-semibold mt-1">{(modelMetrics.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="border p-4 rounded-lg flex flex-col items-center bg-chart-blue/10">
                      <span className="text-xs text-muted-foreground">F1 Score</span>
                      <span className="font-semibold mt-1">{(modelMetrics.f1Score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="border p-4 rounded-lg flex flex-col items-center">
                      <span className="text-xs text-muted-foreground">Avg. Train Time</span>
                      <span className="font-semibold mt-1">2.3s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                  <CardDescription>Optimize your detection model</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab('data')}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Training Data
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('training')}
                    disabled={!trainData}
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    Configure & Train Model
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('results')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Model Results
                  </Button>
                  <Separator className="my-2" />
                  <Button 
                    variant="secondary" 
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Trained Model
                  </Button>
                </CardContent>
                <CardFooter className="bg-amber-50 flex gap-2 text-amber-800 text-xs rounded-b-lg">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>Optimization suggestions available in the Training tab</span>
                </CardFooter>
              </Card>
            </div>
            
            <ModelPerformance 
              accuracy={modelMetrics.accuracy} 
              precision={modelMetrics.precision}
              recall={modelMetrics.recall}
              f1Score={modelMetrics.f1Score}
              confusionMatrix={modelMetrics.confusionMatrix}
            />
            
            <FeatureImportance features={featureImportance} />
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DataUploader onDataUploaded={handleDataUpload} />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Overview</CardTitle>
                  <CardDescription>Statistics for loaded datasets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Training Data</h3>
                      {trainData ? (
                        <div className="space-y-2 text-sm">
                          <p>Samples: <span className="font-medium">{trainData.length}</span></p>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="bg-normal/10">User columns</Badge>
                            <Badge variant="outline" className="bg-normal/10">Operation types</Badge>
                            <Badge variant="outline" className="bg-normal/10">Timestamps</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Data ready for preprocessing and training</p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">No training data uploaded yet</p>
                      )}
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Test Data</h3>
                      {testData ? (
                        <div className="space-y-2 text-sm">
                          <p>Samples: <span className="font-medium">{testData.length}</span></p>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="bg-chart-blue/10">Compatible format</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Ready for model evaluation</p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">No test data uploaded yet</p>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => setActiveTab('training')}
                        disabled={!trainData}
                      >
                        Continue to Training
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Preprocessing Options</CardTitle>
                <CardDescription>Optimize your data for better model performance</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <span className="bg-chart-blue/20 text-chart-blue p-1 rounded-md mr-2">1</span>
                    Missing Value Handling
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Replace missing values with appropriate strategies
                  </p>
                  <div className="text-xs space-y-1">
                    <p>• Numerical: Mean, Median</p>
                    <p>• Categorical: Mode, Missing category</p>
                    <p>• Advanced: KNN or regression imputation</p>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <span className="bg-chart-teal/20 text-chart-teal p-1 rounded-md mr-2">2</span>
                    Feature Engineering
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Create new features to improve model performance
                  </p>
                  <div className="text-xs space-y-1">
                    <p>• Time-based features</p>
                    <p>• User/IP frequency statistics</p>
                    <p>• Operation sequences</p>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <span className="bg-chart-purple/20 text-chart-purple p-1 rounded-md mr-2">3</span>
                    Handling Imbalance
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Address class imbalance in anomaly detection
                  </p>
                  <div className="text-xs space-y-1">
                    <p>• Oversampling with SMOTE</p>
                    <p>• Undersampling techniques</p>
                    <p>• Class weights</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <HyperparameterTuning 
                onParametersUpdate={handleTrainModel}
                isTraining={isTraining} 
              />
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Training Recommendations</CardTitle>
                  <CardDescription>Suggestions to improve model accuracy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-chart-blue p-4 bg-chart-blue/5 rounded-r-md">
                      <h3 className="font-medium mb-1">Optimize Feature Engineering</h3>
                      <p className="text-sm">
                        Create new features by combining 'hour' and 'day_of_week' into time buckets. 
                        Calculate frequency statistics for users and operations.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-chart-teal p-4 bg-chart-teal/5 rounded-r-md">
                      <h3 className="font-medium mb-1">Tune Hyperparameters</h3>
                      <p className="text-sm">
                        Try increasing the number of trees to 200-300. Adjust max_depth based on 
                        complexity of your data. Test different min_samples_split values.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-chart-indigo p-4 bg-chart-indigo/5 rounded-r-md">
                      <h3 className="font-medium mb-1">Compare Multiple Algorithms</h3>
                      <p className="text-sm">
                        Random Forest performs well, but XGBoost and Gradient Boosting often 
                        perform better for anomaly detection. Try ensemble methods.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-chart-purple p-4 bg-chart-purple/5 rounded-r-md">
                      <h3 className="font-medium mb-1">Implement Cross-Validation</h3>
                      <p className="text-sm">
                        Use k-fold cross-validation (k=5) to get more reliable estimates of model 
                        performance and prevent overfitting.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <ModelComparison modelResults={sampleModelResults} />
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="col-span-full">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg">Analysis Results</CardTitle>
                  <CardDescription>Performance evaluation and insights</CardDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">Random Forest</Badge>
                    <Badge variant="outline" className="bg-normal/10 border-normal/20 text-normal">
                      Accuracy: {(modelMetrics.accuracy * 100).toFixed(1)}%
                    </Badge>
                    <Badge variant="outline">Trees: 100</Badge>
                    <Badge variant="outline">Max Depth: 10</Badge>
                    <Badge variant="outline">SMOTE: Enabled</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ModelPerformance 
                    accuracy={modelMetrics.accuracy} 
                    precision={modelMetrics.precision}
                    recall={modelMetrics.recall}
                    f1Score={modelMetrics.f1Score}
                    confusionMatrix={modelMetrics.confusionMatrix}
                  />
                </CardContent>
              </Card>
            </div>
            
            <FeatureImportance features={featureImportance} />
            
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle className="text-lg">Improvement Opportunities</CardTitle>
                <CardDescription>Ways to further increase detection accuracy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Advanced Feature Engineering</h3>
                    <div className="text-sm space-y-2">
                      <p>
                        Create interaction features between user, operation and time features.
                        Identify usage patterns and detect anomalies in those patterns.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Can improve accuracy by 2-5% on complex datasets.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Ensemble Model Approach</h3>
                    <div className="text-sm space-y-2">
                      <p>
                        Combine predictions from multiple models (Random Forest, XGBoost, 
                        and Gradient Boosting) using voting or stacking techniques.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Typically provides 1-3% accuracy improvement.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Threshold Optimization</h3>
                    <div className="text-sm space-y-2">
                      <p>
                        Adjust the probability threshold for anomaly classification based on 
                        your specific needs (balance between precision and recall).
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Can significantly improve detection rate for specific use cases.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('training')}
                  >
                    Back to Training
                  </Button>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
