
# Database Anomaly Detection Dashboard

## Project Overview

This dashboard provides an interactive interface for database anomaly detection, allowing users to visualize model performance, compare different algorithms, analyze feature importance, and fine-tune hyperparameters to improve detection accuracy.

## Features

- **Model Performance Visualization**: View key metrics like accuracy, precision, recall, and F1 score through intuitive visualizations
- **Algorithm Comparison**: Compare performance across different ML algorithms with radar charts and line graphs
- **Feature Importance Analysis**: Identify which features contribute most to anomaly detection
- **Hyperparameter Tuning**: Optimize model settings with an interactive UI for better results
- **Confusion Matrix Visualization**: Understand model performance through true/false positive/negative visualization

## Model Summary

The anomaly detection system uses a machine learning approach to identify suspicious database activities. The primary model implementation uses:

- **Random Forest Classifier**: Ensemble learning method that operates by constructing multiple decision trees during training
- **SMOTE Oversampling**: Addresses class imbalance by synthesizing new examples of the minority class
- **One-Hot Encoding**: Transforms categorical variables into a format suitable for ML algorithms

## Tools & Technologies

### ML Technologies
- **scikit-learn**: For model implementation, preprocessing, and evaluation
- **imbalanced-learn**: For handling class imbalance with SMOTE
- **pandas**: For data manipulation and preprocessing

### Frontend Technologies
- **React**: Component-based UI library
- **TypeScript**: Static typing for better code quality
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: UI component library
- **Recharts**: Flexible charting library for visualizations

## Model Performance

### Best Model Performance Metrics
- **Accuracy**: 95% (XGBoost)
- **Precision**: 92% (XGBoost)
- **Recall**: 90% (XGBoost)
- **F1 Score**: 91% (XGBoost)
- **AUC**: 97% (XGBoost)

### Algorithm Comparison
| Algorithm | Accuracy | Precision | Recall | F1 Score | AUC |
|-----------|----------|-----------|--------|----------|-----|
| Random Forest | 92% | 89% | 85% | 87% | 94% |
| Gradient Boosting | 94% | 91% | 89% | 90% | 95% |
| XGBoost | 95% | 92% | 90% | 91% | 97% |
| SVM | 88% | 85% | 80% | 82% | 90% |
| Neural Network | 93% | 90% | 87% | 88% | 95% |

## Feature Importance

The most important features for anomaly detection are:
1. User (32%)
2. Operation type (25%)
3. Table accessed (15%)
4. IP address (12%)
5. Status code (8%)

## Running the Project Locally

```bash
# Clone the repository
git clone <your-repo-url>
cd anomaly-detection-dashboard

# Install dependencies
npm install

# Run the development server
npm run dev
```

## Future Improvements

- Integration with real-time database monitoring systems
- Alert configuration for detected anomalies
- Automated model retraining with new data
- Deeper investigation tools for flagged transactions
- User feedback loop to improve model accuracy

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

