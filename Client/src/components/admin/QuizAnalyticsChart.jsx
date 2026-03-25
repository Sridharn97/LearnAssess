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
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
      '90–100': 0,
      '80–89': 0,
      '70–79': 0,
      '60–69': 0,
      'Below 60': 0
    };
    quizResults.forEach(result => {
      const score = result.score || 0;
      if (score >= 90) distribution['90–100']++;
      else if (score >= 80) distribution['80–89']++;
      else if (score >= 70) distribution['70–79']++;
      else if (score >= 60) distribution['60–69']++;
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
      const userName = typeof result.userId === 'object'
        ? (result.userId?.name || result.userId?.username || 'Unknown')
        : 'Unknown';
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

  // ── Chart Data ──────────────────────────────────────────────────────────────

  const avgScoreChartData = {
    labels: averageScorePerQuiz.map(item => item.quiz),
    datasets: [
      {
        label: 'Avg Score (%)',
        data: averageScorePerQuiz.map(item => item.average),
        borderColor: '#6366f1',
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.canvas;
          const gradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, 280);
          gradient.addColorStop(0, 'rgba(99,102,241,0.35)');
          gradient.addColorStop(1, 'rgba(99,102,241,0.01)');
          return gradient;
        },
        fill: true,
        tension: 0.45,
        borderWidth: 2.5,
        pointRadius: 5,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 7
      }
    ]
  };

  const scoreDistributionData = {
    labels: Object.keys(scoreDistribution),
    datasets: [
      {
        data: Object.values(scoreDistribution),
        backgroundColor: [
          '#10b981',
          '#6366f1',
          '#f59e0b',
          '#f97316',
          '#ef4444'
        ],
        borderColor: 'transparent',
        borderWidth: 0,
        hoverOffset: 10
      }
    ]
  };

  const attemptsChartData = {
    labels: attemptsPerQuiz.map(item => item.quiz),
    datasets: [
      {
        label: 'Total Attempts',
        data: attemptsPerQuiz.map(item => item.attempts),
        backgroundColor: (ctx) => {
          const { chart } = ctx;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return '#8b5cf6';
          const gradient = c.createLinearGradient(chartArea.right, 0, chartArea.left, 0);
          gradient.addColorStop(0, '#8b5cf6');
          gradient.addColorStop(1, '#c4b5fd');
          return gradient;
        },
        borderColor: 'transparent',
        borderRadius: 6,
        borderSkipped: false
      }
    ]
  };

  const userParticipationData = {
    labels: userParticipation.map(item => item.user),
    datasets: [
      {
        label: 'Quizzes Completed',
        data: userParticipation.map(item => item.quizzesCompleted),
        backgroundColor: (ctx) => {
          const { chart } = ctx;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return '#06b6d4';
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, '#06b6d4');
          gradient.addColorStop(1, '#a5f3fc');
          return gradient;
        },
        borderColor: 'transparent',
        borderRadius: 6,
        borderSkipped: false
      }
    ]
  };

  // ── Shared Options ───────────────────────────────────────────────────────────

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 700, easing: 'easeInOutQuart' },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 12, family: "'Inter', sans-serif" },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.92)',
        padding: 12,
        cornerRadius: 10,
        titleFont: { size: 13, weight: '600', family: "'Inter', sans-serif" },
        bodyFont: { size: 12, family: "'Inter', sans-serif" },
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        callbacks: {}
      }
    }
  };

  const scaleOptions = (suffix = '') => ({
    grid: { color: 'rgba(148,163,184,0.12)', drawBorder: false },
    ticks: {
      font: { size: 11, family: "'Inter', sans-serif" },
      color: '#94a3b8',
      callback: suffix ? (v) => `${v}${suffix}` : undefined
    },
    border: { display: false }
  });

  return (
    <div className="quiz-analytics-container">
      <div className="analytics-heading-row">
        <h2 className="analytics-heading">Quiz Results Analytics</h2>
      </div>

      <div className="charts-grid">
        {averageScorePerQuiz.length > 0 && (
          <Card className="chart-card">
            <div className="chart-card-header">
              <span className="chart-icon">📈</span>
              <div>
                <h3 className="chart-title">Average Score Per Quiz</h3>
                <p className="chart-desc">Mean score across all attempts</p>
              </div>
            </div>
            <div className="chart-wrapper">
              <Line
                data={avgScoreChartData}
                options={{
                  ...baseOptions,
                  scales: {
                    y: { ...scaleOptions('%'), beginAtZero: true, max: 100 },
                    x: { ...scaleOptions() }
                  }
                }}
              />
            </div>
          </Card>
        )}

        {Object.values(scoreDistribution).some(v => v > 0) && (
          <Card className="chart-card chart-card--small">
            <div className="chart-card-header">
              <span className="chart-icon">🎯</span>
              <div>
                <h3 className="chart-title">Score Distribution</h3>
                <p className="chart-desc">How learners scored across ranges</p>
              </div>
            </div>
            <div className="chart-wrapper">
              <Doughnut
                data={scoreDistributionData}
                options={{
                  ...baseOptions,
                  cutout: '62%',
                  plugins: {
                    ...baseOptions.plugins,
                    legend: { ...baseOptions.plugins.legend, position: 'right' }
                  }
                }}
              />
            </div>
          </Card>
        )}

        {attemptsPerQuiz.length > 0 && (
          <Card className="chart-card">
            <div className="chart-card-header">
              <span className="chart-icon">🔁</span>
              <div>
                <h3 className="chart-title">Attempts Per Quiz</h3>
                <p className="chart-desc">Total attempts recorded per quiz</p>
              </div>
            </div>
            <div className="chart-wrapper">
              <Bar
                data={attemptsChartData}
                options={{
                  ...baseOptions,
                  indexAxis: 'y',
                  scales: {
                    x: { ...scaleOptions(), beginAtZero: true },
                    y: { ...scaleOptions() }
                  }
                }}
              />
            </div>
          </Card>
        )}

        {userParticipation.length > 0 && (
          <Card className="chart-card">
            <div className="chart-card-header">
              <span className="chart-icon">🏆</span>
              <div>
                <h3 className="chart-title">Top Users by Completion</h3>
                <p className="chart-desc">Most engaged learners (top 10)</p>
              </div>
            </div>
            <div className="chart-wrapper">
              <Bar
                data={userParticipationData}
                options={{
                  ...baseOptions,
                  scales: {
                    y: { ...scaleOptions(), beginAtZero: true },
                    x: { ...scaleOptions() }
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
