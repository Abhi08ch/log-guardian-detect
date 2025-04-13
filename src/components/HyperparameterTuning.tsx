
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RefreshCw, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HyperparameterTuningProps {
  onParametersUpdate: (parameters: any) => void;
  isTraining: boolean;
}

const HyperparameterTuning: React.FC<HyperparameterTuningProps> = ({ 
  onParametersUpdate, 
  isTraining 
}) => {
  const [algorithm, setAlgorithm] = useState('random_forest');
  const [nEstimators, setNEstimators] = useState(100);
  const [maxDepth, setMaxDepth] = useState(10);
  const [minSamplesSplit, setMinSamplesSplit] = useState(2);
  const [useSmote, setUseSmote] = useState(true);
  const [balanceClasses, setBalanceClasses] = useState(true);
  const [featureEngineering, setFeatureEngineering] = useState(false);
  const [autoCV, setAutoCV] = useState(false);

  const handleApply = () => {
    onParametersUpdate({
      algorithm,
      nEstimators,
      maxDepth,
      minSamplesSplit,
      useSmote,
      balanceClasses,
      featureEngineering,
      autoCV
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Model Configuration</CardTitle>
            <CardDescription>Optimize hyperparameters for better accuracy</CardDescription>
          </div>
          {isTraining && (
            <Badge variant="outline" className="animate-pulse-subtle">
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              Training
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="algorithm">Algorithm</Label>
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger id="algorithm">
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="random_forest">Random Forest</SelectItem>
              <SelectItem value="gradient_boosting">Gradient Boosting</SelectItem>
              <SelectItem value="xgboost">XGBoost</SelectItem>
              <SelectItem value="svm">SVM</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="n_estimators">Number of Trees: {nEstimators}</Label>
          </div>
          <Slider 
            id="n_estimators"
            min={10} 
            max={500} 
            step={10} 
            value={[nEstimators]} 
            onValueChange={(value) => setNEstimators(value[0])} 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="max_depth">Max Depth: {maxDepth}</Label>
          </div>
          <Slider 
            id="max_depth"
            min={1} 
            max={30} 
            step={1} 
            value={[maxDepth]} 
            onValueChange={(value) => setMaxDepth(value[0])} 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="min_samples_split">Min Samples Split: {minSamplesSplit}</Label>
          </div>
          <Slider 
            id="min_samples_split"
            min={2} 
            max={20} 
            step={1} 
            value={[minSamplesSplit]} 
            onValueChange={(value) => setMinSamplesSplit(value[0])} 
          />
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="use_smote">Use SMOTE for oversampling</Label>
            <Switch 
              id="use_smote" 
              checked={useSmote} 
              onCheckedChange={setUseSmote} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="balance_classes">Use class weights</Label>
            <Switch 
              id="balance_classes" 
              checked={balanceClasses} 
              onCheckedChange={setBalanceClasses} 
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="feature_engineering">Enable feature engineering</Label>
            <Switch 
              id="feature_engineering" 
              checked={featureEngineering} 
              onCheckedChange={setFeatureEngineering} 
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto_cv">Cross-validation (K=5)</Label>
            <Switch 
              id="auto_cv" 
              checked={autoCV} 
              onCheckedChange={setAutoCV} 
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleApply} 
          disabled={isTraining} 
          className="w-full"
        >
          <Save className="w-4 h-4 mr-2" />
          Apply & Train Model
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HyperparameterTuning;
