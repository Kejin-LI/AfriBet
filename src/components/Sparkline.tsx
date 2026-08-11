type SparklineProps = {
  values: number[];
  className?: string;
};

export function Sparkline({ values, className }: SparklineProps) {
  const width = 180;
  const height = 58;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} role="img" aria-label="Probability trend">
      <defs>
        <linearGradient id="sparkline-gradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#7C5CFF" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="url(#sparkline-gradient)" strokeLinecap="round" strokeWidth="4" points={points} />
    </svg>
  );
}

