import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';
import Card from '../common/Card';
import './QuizAnalytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const QuizAnalytics = ({ quizResults, quizzes }) => {
  // Calculate analytics data
  const totalQuizzes = quizResults.length;
  const averageScore = totalQuizzes > 0
    ? Math.round(quizResults.reduce((sum, result) => sum + result.score, 0) / totalQuizzes)
    : 0;

  const averageTimeSpent = totalQuizzes > 0
    ? Math.round(quizResults.reduce((sum, result) => sum + result.timeSpent, 0) / totalQuizzes / 60)
    : 0;

  const highestScore = totalQuizzes > 0
    ? Math.max(...quizResults.map(result => result.score))
    : 0;

  // Score distribution for doughnut chart
  const scoreRanges = {
    '90-100%': quizResults.filter(r => r.score >= 90).length,
    '80-89%': quizResults.filter(r => r.score >= 80 && r.score < 90).length,
    '70-79%': quizResults.filter(r => r.score >= 70 && r.score < 80).length,
    '60-69%': quizResults.filter(r => r.score >= 60 && r.score < 70).length,
    'Below 60%': quizResults.filter(r => r.score < 60).length,
  };

  // Performance over time (last 10 attempts)
  const recentResults = quizResults
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10)
    .reverse();

  // Quiz performance by subject/category (assuming quizzes have categories)
  const quizPerformance = quizResults.reduce((acc, result) => {
    const quiz = quizzes.find(q => (q._id || q.id) === (result.quizId._id || result.quizId));
    const quizTitle = quiz ? quiz.title : 'Unknown Quiz';

    if (!acc[quizTitle]) {
      acc[quizTitle] = { total: 0, count: 0 };
    }
    acc[quizTitle].total += result.score;
    acc[quizTitle].count += 1;
    return acc;
  }, {});

  const quizAvgScores = Object.entries(quizPerformance).map(([title, data]) => ({
    title,
    average: Math.round(data.total / data.count),
    attempts: data.count
  }));

  // Skill Proficiency Stats for Radar Chart
  const calculateStandardDeviation = (array) => {
    if (array.length <= 1) return 0;
    const n = array.length;
    const mean = array.reduce((a, b) => a + b) / n;
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
  };

  const accuracy = averageScore;
  const consistency = Math.max(0, Math.min(100, 100 - (quizResults.length > 1 ? calculateStandardDeviation(quizResults.map(r => r.score)) : 0)));
  const persistence = Math.min(100, (new Set(quizResults.map(r => r.quizId?._id || r.quizId)).size / Math.max(1, quizzes.length)) * 100);
  const perfection = Math.min(100, (quizResults.filter(r => r.score === 100).length / Math.max(1, totalQuizzes)) * 100);
  const speed = Math.max(0, Math.min(100, 100 - (averageTimeSpent > 20 ? 100 : averageTimeSpent * 5))); // Normalized speed metric

  // Chart configurations
  const scoreDistributionData = {
    labels: Object.keys(scoreRanges),
    datasets: [
      {
        data: Object.values(scoreRanges),
        backgroundColor: [
          '#10B981', // green-500
          '#3B82F6', // blue-500
          '#F59E0B', // amber-500
          '#F97316', // orange-500
          '#EF4444', // red-500
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const performanceOverTimeData = {
    labels: recentResults.map((_, index) => `Attempt ${index + 1}`),
    datasets: [
      {
        label: 'Score (%)',
        data: recentResults.map(result => result.score),
        borderColor: '#3B82F6',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.0)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)');
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#3B82F6',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#3B82F6',
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const quizComparisonData = {
    labels: quizAvgScores.map(item => item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title),
    datasets: [
      {
        label: 'Average Score (%)',
        data: quizAvgScores.map(item => item.average),
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 1,
      },
    ],
  };

  const skillProficiencyData = {
    labels: ['Accuracy', 'Consistency', 'Persistence', 'Perfection', 'Speed'],
    datasets: [
      {
        label: 'Your Skills',
        data: [accuracy, consistency, persistence, perfection, speed],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3B82F6',
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3B82F6',
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1E293B',
        padding: 12,
        titleFont: { size: 14, weight: '600' },
        bodyFont: { size: 13 },
        displayColors: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.04)',
          drawBorder: false,
        },
        ticks: {
          stepSize: 20,
          font: { size: 11 },
          color: '#64748B',
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: { size: 11 },
          color: '#64748B',
        }
      }
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Average Score by Quiz',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: true,
          drawBorder: false,
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Skill Proficiency',
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          display: false,
        },
        grid: {
          color: '#E5E7EB',
        },
        angleLines: {
          color: '#E5E7EB',
        },
        pointLabels: {
          font: {
            size: 12,
            weight: '600',
          },
          color: '#4B5563',
        }
      }
    }
  };

  if (totalQuizzes === 0) {
    return (
      <div className="quiz-analytics">
        <div className="no-data-message">
          <Target size={48} className="no-data-icon" />
          <h3>No Quiz Results Yet</h3>
          <p>Complete some quizzes to see your performance analytics here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-analytics">
      {/* Summary Cards */}
      <div className="analytics-summary">
        <Card className="metric-card">
          <div className="metric-content">
            <h3 className="metric-value">{averageScore}%</h3>
            <p className="metric-label">Average Score</p>
          </div>
        </Card>

        <Card className="metric-card">
          <div className="metric-content">
            <h3 className="metric-value">{totalQuizzes}</h3>
            <p className="metric-label">Total Quizzes Taken</p>
          </div>
        </Card>

        <Card className="metric-card">
          <div className="metric-content">
            <h3 className="metric-value">{averageTimeSpent}</h3>
            <p className="metric-label">Avg. Time (minutes)</p>
          </div>
        </Card>

        <Card className="metric-card">
          <div className="metric-content">
            <h3 className="metric-value">{highestScore}%</h3>
            <p className="metric-label">Highest Score</p>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts">
        {/* Score Distribution */}
        <Card className="chart-card">
          <h3 className="chart-title">Result Distribution</h3>
          <div className="chart-container doughnut-container">
            <Doughnut data={scoreDistributionData} options={doughnutOptions} />
          </div>
        </Card>

        {/* Performance Over Time */}
        <Card className="chart-card">
          <h3 className="chart-title">Performance Progress</h3>
          <div className="chart-container line-container">
            <Line data={performanceOverTimeData} options={lineOptions} />
          </div>
        </Card>

        {/* Quiz Comparison */}
        <Card className="chart-card">
          <h3 className="chart-title">Quiz Comparison</h3>
          <div className="chart-container bar-container">
            <Bar data={quizComparisonData} options={barOptions} />
          </div>
        </Card>

        {/* Skill Proficiency */}
        <Card className="chart-card">
          <h3 className="chart-title">Skillset Analysis</h3>
          <div className="chart-container radar-container">
            <Radar data={skillProficiencyData} options={radarOptions} />
          </div>
        </Card>
      </div>

      {/* Detailed Results Table */}
      <Card className="results-table-card">
        <h3 className="chart-title">Recent Quiz Results</h3>
        <div className="results-table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Score</th>
                <th>Correct Answers</th>
                <th>Time Spent</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {quizResults
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 10)
                .map((result, index) => {
                  const quiz = quizzes.find(q => (q._id || q.id) === (result.quizId._id || result.quizId));
                  const quizTitle = quiz ? quiz.title : 'Unknown Quiz';
                  const date = new Date(result.createdAt).toLocaleDateString();
                  const timeInMinutes = Math.round(result.timeSpent / 60);

                  return (
                    <tr key={index}>
                      <td className="quiz-title-cell">{quizTitle}</td>
                      <td className={`score-cell ${result.score >= 80 ? 'high-score' : result.score >= 60 ? 'medium-score' : 'low-score'}`}>
                        {result.score}%
                      </td>
                      <td>{result.correctAnswers}/{result.totalQuestions}</td>
                      <td>{timeInMinutes} min</td>
                      <td>{date}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default QuizAnalytics;