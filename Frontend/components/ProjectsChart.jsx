import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function ProjectsChart({ projects = [] }) {
  const total = projects.length;
  const completed = projects.filter((p) => p.completed).length;
  const active = Math.max(0, total - completed);

  const data = {
    labels: ['Active', 'Completed'],
    datasets: [
      {
        data: [active, completed],
        backgroundColor: ['#34d399', '#f97316'],
        hoverBackgroundColor: ['#10b981', '#fb923c'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { position: 'bottom', labels: { color: '#e2e8f0' } },
      tooltip: { enabled: true },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="projects-chart" style={{ width: 300, height: 160 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default ProjectsChart;
