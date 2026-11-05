"""
SmartAssess AI: Model Training Pipeline
Trains Decision Tree and Random Forest models on synthetic academic performance data
to predict student academic risk (LOW, MODERATE, HIGH) and future exam performance.
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error, r2_score
import joblib

def generate_synthetic_academic_dataset(n_samples=2500, random_seed=42):
    """
    Generates realistic academic dataset with features:
    - quiz_avg: Average quiz percentage (0-100)
    - assignment_completion_rate: % of assignments submitted (0-100)
    - min_module_score: Lowest module quiz score (0-100)
    - attempts_per_quiz: Average attempts taken (1-5)
    - score_trend_slope: Trend of scores over time (-20 to +20)
    - late_submission_ratio: Ratio of late submissions (0-1)
    """
    np.random.seed(random_seed)
    
    quiz_avg = np.clip(np.random.normal(70, 18, n_samples), 10, 100)
    assignment_completion_rate = np.clip(quiz_avg * 0.9 + np.random.normal(10, 12, n_samples), 0, 100)
    min_module_score = np.clip(quiz_avg - np.random.uniform(5, 30, n_samples), 0, 95)
    attempts_per_quiz = np.clip(1 + (100 - quiz_avg) / 30 + np.random.normal(0, 0.4, n_samples), 1, 5)
    score_trend_slope = np.clip((quiz_avg - 60) / 4 + np.random.normal(0, 5, n_samples), -25, 25)
    late_submission_ratio = np.clip((100 - assignment_completion_rate) / 100 * 0.8 + np.random.normal(0, 0.1, n_samples), 0, 1)

    # Future final assessment score (ground truth with noise)
    future_score = (
        0.40 * quiz_avg +
        0.25 * min_module_score +
        0.20 * assignment_completion_rate +
        0.15 * (50 + score_trend_slope * 2) -
        (late_submission_ratio * 10) +
        np.random.normal(0, 4, n_samples)
    )
    future_score = np.clip(future_score, 5, 100)

    # Risk category:
    # HIGH: future_score < 45 or min_module_score < 40
    # MODERATE: 45 <= future_score < 65
    # LOW: future_score >= 65
    risk_labels = []
    for f_score, m_score in zip(future_score, min_module_score):
        if f_score < 45 or m_score < 40:
            risk_labels.append("HIGH")
        elif f_score < 65:
            risk_labels.append("MODERATE")
        else:
            risk_labels.append("LOW")

    df = pd.DataFrame({
        'quiz_avg': quiz_avg,
        'assignment_completion_rate': assignment_completion_rate,
        'min_module_score': min_module_score,
        'attempts_per_quiz': attempts_per_quiz,
        'score_trend_slope': score_trend_slope,
        'late_submission_ratio': late_submission_ratio,
        'future_score': future_score,
        'risk_label': risk_labels
    })

    return df

def train_and_save_models():
    print("Generating synthetic academic dataset...")
    df = generate_synthetic_academic_dataset()

    features = ['quiz_avg', 'assignment_completion_rate', 'min_module_score', 
                'attempts_per_quiz', 'score_trend_slope', 'late_submission_ratio']
    
    X = df[features]
    y_class = df['risk_label']
    y_reg = df['future_score']

    X_train, X_test, y_class_train, y_class_test, y_reg_train, y_reg_test = train_test_split(
        X, y_class, y_reg, test_size=0.2, random_state=42, stratify=y_class
    )

    print("Training Random Forest Classifier for Academic Risk...")
    rf_clf = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    rf_clf.fit(X_train, y_class_train)

    y_class_pred = rf_clf.predict(X_test)
    acc = accuracy_score(y_class_test, y_class_pred)
    print(f"Random Forest Classification Accuracy: {acc:.4f}")
    print(classification_report(y_class_test, y_class_pred))

    print("Training Decision Tree Classifier for transparent rules...")
    dt_clf = DecisionTreeClassifier(max_depth=5, min_samples_leaf=15, random_state=42)
    dt_clf.fit(X_train, y_class_train)
    dt_acc = accuracy_score(y_class_test, dt_clf.predict(X_test))
    print(f"Decision Tree Classification Accuracy: {dt_acc:.4f}")

    print("Training Random Forest Regressor for Future Assessment Score...")
    rf_reg = RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42)
    rf_reg.fit(X_train, y_reg_train)
    r2 = r2_score(y_reg_test, rf_reg.predict(X_test))
    print(f"Regression R^2 Score: {r2:.4f}")

    os.makedirs("./models", exist_ok=True)
    joblib.dump(rf_clf, "./models/student_risk_classifier.joblib")
    joblib.dump(dt_clf, "./models/decision_tree_classifier.joblib")
    joblib.dump(rf_reg, "./models/score_regressor.joblib")

    # Save feature importances and metadata
    metadata = {
        "model_version": "RandomForest-v1.2",
        "training_samples": len(df),
        "classification_accuracy": float(acc),
        "r2_score": float(r2),
        "feature_names": features,
        "feature_importances": dict(zip(features, [float(x) for x in rf_clf.feature_importances_]))
    }
    with open("./models/model_metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)

    print("Model training successfully completed and serialized to ./models/")

if __name__ == "__main__":
    train_and_save_models()
