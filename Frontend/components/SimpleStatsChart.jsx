
// Very small SVG bar chart to visualize basic stats
function SimpleStatsChart({ stats = {} }) {
  const items = [
    { key: 'total', label: 'Total', value: stats.total || 0, color: '#60a5fa' },
    { key: 'active', label: 'Active', value: stats.active || 0, color: '#34d399' },
    { key: 'completed', label: 'Completed', value: stats.completed || 0, color: '#f97316' },
  ];

  const max = Math.max(1, ...items.map((i) => i.value));
  const width = 260;
  const barWidth = 60;
  const gap = 16;
  const height = 100;

  return (
    <svg className="stats-chart" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {items.map((it, idx) => {
        const x = idx * (barWidth + gap) + 10;
        const h = (it.value / max) * (height - 36);
        const y = height - h - 24;
        return (
          <g key={it.key}>
            <rect x={x} y={y} width={barWidth} height={h} rx={8} fill={it.color} opacity={0.95} />
            <text x={x + barWidth / 2} y={height - 6} fontSize={11} fill="#e2e8f0" textAnchor="middle">
              {it.label}
            </text>
            <text x={x + barWidth / 2} y={y - 6} fontSize={12} fill="#e2e8f0" textAnchor="middle">
              {it.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default SimpleStatsChart;
