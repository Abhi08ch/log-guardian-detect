
// This file contains utility functions for the anomaly detection dashboard

// Sample feature importance data (in a real app, this would come from the ML model)
export const sampleFeatureImportance = [
  { name: 'user', importance: 0.32 },
  { name: 'operation', importance: 0.25 },
  { name: 'table', importance: 0.15 },
  { name: 'ip_address', importance: 0.12 },
  { name: 'status', importance: 0.08 },
  { name: 'hour', importance: 0.05 },
  { name: 'day_of_week', importance: 0.03 },
];

// Sample performance metrics for different models
export const sampleModelResults = [
  {
    name: 'Random Forest',
    accuracy: 0.92,
    precision: 0.89,
    recall: 0.85,
    f1: 0.87,
    auc: 0.94,
    color: '#2563EB',
  },
  {
    name: 'Gradient Boosting',
    accuracy: 0.94,
    precision: 0.91,
    recall: 0.89,
    f1: 0.90,
    auc: 0.95,
    color: '#14B8A6',
  },
  {
    name: 'XGBoost',
    accuracy: 0.95,
    precision: 0.92,
    recall: 0.90,
    f1: 0.91,
    auc: 0.97,
    color: '#6366F1',
  },
  {
    name: 'SVM',
    accuracy: 0.88,
    precision: 0.85,
    recall: 0.80,
    f1: 0.82,
    auc: 0.90,
    color: '#A855F7',
  },
  {
    name: 'Neural Network',
    accuracy: 0.93,
    precision: 0.90,
    recall: 0.87,
    f1: 0.88,
    auc: 0.95,
    color: '#EC4899',
  }
];

// Simulated confusion matrix data
export const sampleConfusionMatrix = [
  [142, 8],   // [TN, FP]
  [10, 40]    // [FN, TP]
];

// Calculate performance metrics from a confusion matrix
export const calculateMetricsFromMatrix = (matrix: number[][]) => {
  const tn = matrix[0][0];
  const fp = matrix[0][1];
  const fn = matrix[1][0];
  const tp = matrix[1][1];
  
  const accuracy = (tp + tn) / (tp + tn + fp + fn);
  const precision = tp / (tp + fp);
  const recall = tp / (tp + fn);
  const f1Score = 2 * ((precision * recall) / (precision + recall));
  
  return {
    accuracy,
    precision,
    recall,
    f1Score
  };
};

// Sample data for training performance history
export const trainingHistory = [
  { epoch: 1, accuracy: 0.70, loss: 0.42 },
  { epoch: 2, accuracy: 0.76, loss: 0.36 },
  { epoch: 3, accuracy: 0.82, loss: 0.30 },
  { epoch: 4, accuracy: 0.87, loss: 0.24 },
  { epoch: 5, accuracy: 0.91, loss: 0.18 },
  { epoch: 6, accuracy: 0.93, loss: 0.14 },
  { epoch: 7, accuracy: 0.94, loss: 0.12 },
  { epoch: 8, accuracy: 0.95, loss: 0.10 }
];

// Simulate model training with different configurations
export const simulateModelTraining = (config: any) => {
  return new Promise<{
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    confusionMatrix: number[][];
    featureImportance: { name: string; importance: number }[];
  }>((resolve) => {
    // In a real app, this would call a backend API
    setTimeout(() => {
      // Simulate different results based on configuration
      let baseAccuracy = 0.85;
      
      // Algorithm impact
      if (config.algorithm === 'random_forest') baseAccuracy += 0.02;
      if (config.algorithm === 'gradient_boosting') baseAccuracy += 0.03;
      if (config.algorithm === 'xgboost') baseAccuracy += 0.05;
      
      // Hyperparameter impact
      baseAccuracy += Math.min(0.03, (config.nEstimators / 500) * 0.02);
      baseAccuracy += Math.min(0.02, (config.maxDepth / 30) * 0.02);
      
      // Feature engineering impact
      if (config.featureEngineering) baseAccuracy += 0.03;
      
      // Balancing strategies impact
      if (config.useSmote) baseAccuracy += 0.02;
      if (config.balanceClasses) baseAccuracy += 0.01;
      
      // Cross-validation impact
      if (config.autoCV) baseAccuracy += 0.01;
      
      // Add some randomness (±1%)
      baseAccuracy += (Math.random() - 0.5) * 0.02;
      
      // Cap at 0.99
      baseAccuracy = Math.min(0.99, baseAccuracy);
      
      // Calculate other metrics based on accuracy
      const precision = baseAccuracy - (Math.random() * 0.05);
      const recall = baseAccuracy - (Math.random() * 0.07);
      const f1Score = 2 * ((precision * recall) / (precision + recall));
      
      // Generate a realistic confusion matrix
      const total = 200;
      const anomalies = 50;
      const normals = total - anomalies;
      
      const tp = Math.floor(recall * anomalies);
      const fn = anomalies - tp;
      const fp = Math.floor(normals * (1 - baseAccuracy));
      const tn = normals - fp;
      
      const confusionMatrix = [
        [tn, fp], 
        [fn, tp]
      ];
      
      // Generate feature importance
      const featureImportance = [...sampleFeatureImportance];
      
      // Shuffle feature importance slightly
      featureImportance.forEach(f => {
        f.importance *= 0.8 + (Math.random() * 0.4);
      });
      
      // Return the simulated results
      resolve({
        accuracy: baseAccuracy,
        precision,
        recall,
        f1Score,
        confusionMatrix,
        featureImportance
      });
    }, 2000); // Simulate 2-second training time
  });
};
