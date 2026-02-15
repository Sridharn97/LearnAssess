import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import Card from '../common/Card';
import './QuizAnalyticsChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const QuizAnalyticsChart = ({ quizResults, quizzes }) => {
  // Average score per quiz
  const averageScorePerQuiz = useMemo(() => {
    const scoreMap = new Map();
    quizResults.forEach(result => {
      const quizId = typeof result.quizId === 'object' ? result.quizId?._id : result.quizId;
      const quizTitle = typeof result.quizId === 'object' ? result.quizId?.title : 'Unknown';
      if (!scoreMap.has(quizId)) {
        scoreMap.set(quizId, { title: quizTitle, scores: [] });
      }
      scoreMap.get(quizId).scores.push(result.score || 0);
    });

    const averages = Array.from(scoreMap.values()).map(item => ({
      quiz: item.title,
      average: (item.scores.reduce((a, b) => a + b, 0) / item.scores.length).toFixed(2)
    }));
    return averages;
  }, [quizResults]);

  // Score distribution
  const scoreDistribution = useMemo(() => {
    const distribution = {
      '90-100': 0,
      '80-89': 0,
      '70-79': 0,
      '60-69': 0,
      'Below 60': 0
    };
    quizResults.forEach(result => {
      const score = result.score || 0;
      if (score >= 90) distribution['90-100']++;
      else if (score >= 80) distribution['80-89']++;
      else if (score >= 70) distribution['70-79']++;
      else if (score >= 60) distribution['60-69']++;
      else distribution['Below 60']++;
    });
    return distribution;
  }, [quizResults]);

  // Attempts per quiz
  const attemptsPerQuiz = useMemo(() => {
    const attemptsMap = new Map();
    quizResults.forEach(result => {
      const quizId = typeof result.quizId === 'object' ? result.quizId?._id : result.quizId;
      const quizTitle = typeof result.quizId === 'object' ? result.quizId?.title : 'Unknown';
      if (!attemptsMap.has(quizId)) {
        attemptsMap.set(quizId, { title: quizTitle, count: 0 });
      }
      attemptsMap.get(quizId).count++;
    });

    return Array.from(attemptsMap.values()).map(item => ({
      quiz: item.title,
      attempts: item.count
    }));
  }, [quizResults]);

  // User participation
  const userParticipation = useMemo(() => {
    const userMap = new Map();
    quizResults.forEach(result => {
      const userId = typeof result.userId === 'object' ? result.userId?._id : result.userId;
      const userName = typeof result.userId === 'object' ? result.userId?.name : 'Unknown';
      if (!userMap.has(userId)) {
        userMap.set(userId, { name: userName, quizzes: new Set() });
      }
      const quizId = typeof result.quizId === 'object' ? result.quizId?._id : result.quizId;
      userMap.get(userId).quizzes.add(quizId);
    });

    return Array.from(userMap.values())
      .map(item => ({
        user: item.name,
        quizzesCompleted: item.quizzes.size
      }))
      .sort((a, b) => b.quizzesCompleted - a.quizzesCompleted)
      .slice(0, 10);
  }, [quizResults]);

  // Average Score Per Quiz Chart
  const avgScoreChartData = {
    labels: averageScorePerQuiz.map(item => item.quiz),
    datasets: [
      {
        label: 'Average Score (%)',
        data: averageScorePerQuiz.map(item => item.average),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  // Score Distribution Pie Chart
  const scoreDistributionData = {
    labels: Object.keys(scoreDistribution),
    datasets: [
      {
        data: Object.values(scoreDistribution),
        backgroundColor: [
          '#10b981',
          '#3b82f6',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6'
        ],
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  };

  // Attempts Per Quiz Bar Chart
  const attemptsChartData = {
    labels: attemptsPerQuiz.map(item => item.quiz),
    datasets: [
      {
        label: 'Total Attempts',
        data: attemptsPerQuiz.map(item => item.attempts),
        backgroundColor: '#8b5cf6',
        borderColor: '#7c3aed',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  // User Participation Bar Chart
  const userParticipationData = {
    labels: userParticipation.map(item => item.user),
    datasets: [
      {
        label: 'Quizzes Completed',
        data: userParticipation.map(item => item.quizzesCompleted),
        backgroundColor: '#06b6d4',
        borderColor: '#0891b2',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12
          },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        borderColor: '#e5e7eb',
        borderWidth: 1
      }
    }
  };

  return (
    <div className="quiz-analytics-container">
      <h2 className="analytics-heading">Quiz Results Analytics</h2>

      <div className="charts-grid">
        {averageScorePerQuiz.length > 0 && (
          <Card className="chart-card">
            <h3 className="chart-title">Average Score Per Quiz</h3>
            <div className="chart-wrapper">
              <Line
                data={avgScoreChartData}
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: { font: { size: 11 } }
                    },
                    x: {
                      ticks: { font: { size: 11 } }
                    }
                  }
                }}
              />
            </div>
          </Card>
        )}

        {Object.values(scoreDistribution).some(v => v > 0) && (
          <Card className="chart-card">
            <h3 className="chart-title">Score Distribution</h3>
            <div className="chart-wrapper pie-wrapper">
              <Doughnut
                data={scoreDistributionData}
                options={{
                  ...chartOptions,
                  maintainAspectRatio: false
                }}
              />
            </div>
          </Card>
        )}

        {attemptsPerQuiz.length > 0 && (
          <Card className="chart-card">
            <h3 className="chart-title">Quiz Attempts</h3>
            <div className="chart-wrapper">
              <Bar
                data={attemptsChartData}
                options={{
                  ...chartOptions,
                  indexAxis: 'y',
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: { font: { size: 11 } }
                    },
                    y: {
                      ticks: { font: { size: 11 } }
                    }
                  }
                }}
              />
            </div>
          </Card>
        )}

        {userParticipation.length > 0 && (
          <Card className="chart-card">
            <h3 className="chart-title">Top Users by Quiz Completion</h3>
            <div className="chart-wrapper">
              <Bar
                data={userParticipationData}
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { font: { size: 11 } }
                    },
                    x: {
                      ticks: { font: { size: 11 } }
                    }
                  }
                }}
              />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizAnalyticsChart;
