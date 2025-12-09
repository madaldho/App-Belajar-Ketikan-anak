# Scoring System

## WPM Calculation (Words Per Minute)
```
WPM = (Correct Characters / 5) / Minutes Elapsed
```
- Standard word length = 5 characters
- Only **correct characters** count toward WPM
- Real-time calculation during test

## KPM (Karakter Per Menit)
```
KPM = Correct Characters / Minutes Elapsed
```
- Alternative metric showing raw character speed
- Displayed in real-time stats

## Accuracy Calculation
```
Accuracy = (Correct Characters / Total Typed) × 100
```
- Percentage of correctly typed characters
- Updates in real-time

## Final Score Formula
```
Base Score = WPM × 10
Accuracy Multiplier = Accuracy / 100
Error Penalty = Total Errors × 3

Final Score = (Base Score × Accuracy Multiplier) - Error Penalty
```

### Example:
- WPM: 45
- Accuracy: 95%
- Errors: 10

```
Base Score = 45 × 10 = 450
Accuracy Multiplier = 95 / 100 = 0.95
Error Penalty = 10 × 3 = 30

Final Score = (450 × 0.95) - 30 = 427.5 - 30 = 397
```

## Scoring Philosophy
1. **Speed matters** - Higher WPM = higher base score
2. **Accuracy is crucial** - Acts as multiplier (95% accuracy = 95% of base score)
3. **Errors are penalized** - Each error costs 3 points
4. **Balanced approach** - Fast but inaccurate typing won't win

## Leaderboard Ranking
- Sorted by **Final Score** (descending)
- Top 3 get special visual treatment (medals)
- Displays: WPM, Accuracy, and Final Score in badges
