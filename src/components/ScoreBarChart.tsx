import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } from "chart.js";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement // Necesario para gráficos de tipo "Pie" o "Dona"
  );


interface ScoreBarChartProps {
  results: {
    timestamp: string;
    score: number;
    questionBlock: string;
  }[];
}

const ScoreBarChart: React.FC<ScoreBarChartProps> = ({ results }) => {
  const data = {
    labels: results.map((result) =>
      `${result.questionBlock} (${new Date(result.timestamp).toLocaleDateString()})`
    ),
    datasets: [
      {
        label: "Puntaje",
        data: results.map((result) => result.score),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ScoreBarChart;