import { useMemo, useRef, useState, type PointerEvent } from 'react';
import type { Locale, Market, OutcomeId } from '@/types/domain';
import { cn } from '@/lib/utils';

type ProbabilityChartProps = {
  market: Market;
  locale: Locale;
  className?: string;
};

type ChartRange = 'day' | 'week' | 'month';

const fallbackColors = ['#60A5FA', '#A855F7', '#F59E0B', '#F97316', '#10B981'];
const outcomeColors: Record<string, string> = {
  yes: '#34D399',
  no: '#FB7185',
};

const localeMap: Record<Locale, string> = {
  sw: 'sw-TZ',
  en: 'en-US',
  zh: 'zh-CN',
};

const rangeCopy: Record<Locale, Record<ChartRange, string>> = {
  sw: {
    day: 'Siku',
    week: 'Wiki',
    month: 'Mwezi',
  },
  en: {
    day: 'Day',
    week: 'Week',
    month: 'Month',
  },
  zh: {
    day: '日',
    week: '周',
    month: '月',
  },
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function getYDomain(series: number[][]) {
  const values = series.flat().map(clamp);
  const minValue = values.length > 0 ? Math.min(...values) : 0;
  const maxValue = values.length > 0 ? Math.max(...values) : 100;
  const range = Math.max(maxValue - minValue, 1);
  const padding = Math.max(6, range * 0.18);
  let min = Math.max(0, Math.floor((minValue - padding) / 5) * 5);
  let max = Math.min(100, Math.ceil((maxValue + padding) / 5) * 5);

  if (max - min < 30) {
    const center = (min + max) / 2;
    min = Math.max(0, Math.floor((center - 15) / 5) * 5);
    max = Math.min(100, Math.ceil((center + 15) / 5) * 5);
  }

  return { min, max };
}

function getYTicks(min: number, max: number) {
  const step = Math.max(5, Math.round((max - min) / 4 / 5) * 5);
  const ticks: number[] = [];

  for (let value = max; value >= min; value -= step) {
    ticks.push(value);
  }

  if (ticks.at(-1) !== min) {
    ticks.push(min);
  }

  return ticks;
}

function getOutcomeColor(market: Market, index: number) {
  const outcomeId = market.outcomes[index]?.id;
  return outcomeId && outcomeColors[outcomeId] ? outcomeColors[outcomeId] : fallbackColors[index % fallbackColors.length];
}

function getOutcomeTextClass(outcomeId: OutcomeId | undefined) {
  if (outcomeId === 'yes') {
    return 'text-emerald-100';
  }

  if (outcomeId === 'no') {
    return 'text-rose-100';
  }

  return 'text-white/82';
}

function buildSeries(market: Market) {
  const base = market.sparkline;
  const baseAverage = base.reduce((sum, value) => sum + value, 0) / Math.max(base.length, 1);

  return market.outcomes.map((outcome, index) => {
    if (index === 0) {
      return base.map(clamp);
    }

    if (market.outcomes.length === 2 && index === 1) {
      return base.map((value) => clamp(100 - value));
    }

    const probability = outcome.probability;
    return base.map((value, pointIndex) => {
      const direction = index % 2 === 0 ? 1 : -1;
      const volatility = (value - baseAverage) * (0.25 + index * 0.08);
      const drift = (pointIndex - base.length / 2) * direction * 0.6;
      return clamp(probability + volatility + drift);
    });
  });
}

function getPointDate(index: number, length: number, range: ChartRange) {
  const now = new Date();
  const maxIndex = Math.max(length - 1, 1);
  const progress = index / maxIndex;
  const rangeMs = {
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
  }[range];

  return new Date(now.getTime() - rangeMs * (1 - progress));
}

function formatTickDate(date: Date, range: ChartRange, locale: Locale) {
  if (range === 'day') {
    return new Intl.DateTimeFormat(localeMap[locale], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: locale === 'en',
    }).format(date);
  }

  return new Intl.DateTimeFormat(localeMap[locale], {
    month: 'numeric',
    day: 'numeric',
  }).format(date);
}

function formatTooltipDate(date: Date, range: ChartRange, locale: Locale) {
  if (range === 'day') {
    return new Intl.DateTimeFormat(localeMap[locale], {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: locale === 'en',
    }).format(date);
  }

  return new Intl.DateTimeFormat(localeMap[locale], {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function ProbabilityChart({ market, locale, className }: ProbabilityChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [range, setRange] = useState<ChartRange>('day');
  const width = 520;
  const height = 158;
  const plot = {
    left: 8,
    right: 56,
    top: 4,
    bottom: 18,
  };
  const plotWidth = width - plot.left - plot.right;
  const plotHeight = height - plot.top - plot.bottom;
  const series = useMemo(() => buildSeries(market), [market]);
  const yDomain = useMemo(() => getYDomain(series), [series]);
  const yTicks = useMemo(() => getYTicks(yDomain.min, yDomain.max), [yDomain]);
  const activeIndex = hoveredIndex ?? ((series[0]?.length ?? 1) - 1);

  function toY(value: number) {
    const ratio = (clamp(value) - yDomain.min) / Math.max(yDomain.max - yDomain.min, 1);
    return plot.top + (1 - ratio) * plotHeight;
  }

  function toPoints(values: number[]) {
    return values
      .map((value, index) => {
        const x = plot.left + (index / Math.max(values.length - 1, 1)) * plotWidth;
        const y = toY(value);
        return `${x},${y}`;
      })
      .join(' ');
  }

  function pointAt(values: number[]) {
    const value = values[activeIndex] ?? values[values.length - 1] ?? 0;
    return {
      x: plot.left + (activeIndex / Math.max(values.length - 1, 1)) * plotWidth,
      y: toY(value),
    };
  }

  function handlePointerMove(event: PointerEvent<SVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || !series[0]?.length) {
      return;
    }

    const x = ((event.clientX - rect.left) / rect.width) * width;
    const ratio = (x - plot.left) / plotWidth;
    const nextIndex = Math.round(ratio * (series[0].length - 1));
    setHoveredIndex(Math.max(0, Math.min(series[0].length - 1, nextIndex)));
  }

  const tooltipX = plot.left + (activeIndex / Math.max((series[0]?.length ?? 1) - 1, 1)) * plotWidth;
  const tooltipLabelX = tooltipX > width - 170 ? tooltipX - 154 : tooltipX + 10;
  const tooltipAnchor: 'start' | 'end' = tooltipX > width - 170 ? 'end' : 'start';
  const dateLabel = formatTooltipDate(getPointDate(activeIndex, series[0]?.length ?? 1, range), range, locale);
  const xTicks = Array.from(
    new Set([0, Math.round(((series[0]?.length ?? 1) - 1) / 3), Math.round((((series[0]?.length ?? 1) - 1) * 2) / 3), (series[0]?.length ?? 1) - 1]),
  );
  const tooltipRows = series
    .map((values, index) => {
      const value = clamp(values[activeIndex] ?? 0);
      const pointY = toY(value);
      return {
        index,
        value,
        pointY,
        labelY: pointY,
        color: getOutcomeColor(market, index),
        label: `${market.outcomes[index]?.label[locale] ?? ''} ${Math.round(value)}%`,
      };
    })
    .sort((a, b) => a.pointY - b.pointY);

  for (let index = 1; index < tooltipRows.length; index += 1) {
    const previous = tooltipRows[index - 1];
    const current = tooltipRows[index];
    if (current.labelY - previous.labelY < 28) {
      current.labelY = previous.labelY + 28;
    }
  }

  const overflowBottom = tooltipRows.at(-1) ? tooltipRows.at(-1)!.labelY + 12 - (plot.top + plotHeight) : 0;
  if (overflowBottom > 0) {
    tooltipRows.forEach((row) => {
      row.labelY -= overflowBottom;
    });
  }

  const overflowTop = tooltipRows[0] ? plot.top - (tooltipRows[0].labelY - 12) : 0;
  if (overflowTop > 0) {
    tooltipRows.forEach((row) => {
      row.labelY += overflowTop;
    });
  }

  return (
    <div className={cn('flex min-h-[150px] flex-col gap-1.5', className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-white/58">
          {market.outcomes.map((outcome, index) => (
            <div key={outcome.id} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getOutcomeColor(market, index) }} />
              <span className={cn('truncate', getOutcomeTextClass(outcome.id))}>{outcome.label[locale]}</span>
              <span className="font-black text-white/82">{outcome.probability}%</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 rounded-lg border border-white/10 bg-white/[0.04] p-0.5 text-[11px] font-black">
          {(['day', 'week', 'month'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setRange(item);
                setHoveredIndex(null);
              }}
              className={cn(
                'rounded-md px-2 py-1 transition',
                range === item ? 'bg-cyan-300 text-[#071018]' : 'text-white/46 hover:bg-white/8 hover:text-white',
              )}
            >
              {rangeCopy[locale][item]}
            </button>
          ))}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="min-h-0 flex-1 cursor-crosshair"
        role="img"
        aria-label="Probability trend"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoveredIndex(null)}
      >
        {yTicks.map((tick) => {
          const y = toY(tick);
          return (
            <g key={tick}>
              <line
                x1={plot.left}
                x2={plot.left + plotWidth}
                y1={y}
                y2={y}
                className="stroke-slate-300/60 dark:stroke-white/14"
                strokeDasharray="2 4"
                strokeWidth="1"
              />
              <line
                x1={plot.left + plotWidth}
                x2={plot.left + plotWidth + 5}
                y1={y}
                y2={y}
                className="stroke-slate-400/70 dark:stroke-white/35"
                strokeWidth="1"
              />
              <text
                x={width - 6}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-500 dark:fill-white/62"
                fontSize="13"
                fontWeight="700"
              >
                {tick}%
              </text>
            </g>
          );
        })}

        <line
          x1={plot.left + plotWidth}
          x2={plot.left + plotWidth}
          y1={plot.top}
          y2={plot.top + plotHeight}
          className="stroke-slate-300/70 dark:stroke-white/20"
          strokeWidth="1"
        />

        {xTicks.map((index) => {
          const x = plot.left + (index / Math.max((series[0]?.length ?? 1) - 1, 1)) * plotWidth;
          return (
            <g key={`x-${index}`}>
              <line
                x1={x}
                x2={x}
                y1={plot.top + plotHeight}
                y2={plot.top + plotHeight + 5}
                className="stroke-slate-400/70 dark:stroke-white/28"
                strokeWidth="1"
              />
              <text
                x={x}
                y={height - 5}
                textAnchor={index === 0 ? 'start' : index === (series[0]?.length ?? 1) - 1 ? 'end' : 'middle'}
                className="fill-slate-500 dark:fill-white/54"
                fontSize="12"
                fontWeight="700"
              >
                {formatTickDate(getPointDate(index, series[0]?.length ?? 1, range), range, locale)}
              </text>
            </g>
          );
        })}

        {series.map((values, index) => {
          const endPoint = pointAt(values);
          const color = getOutcomeColor(market, index);
          return (
            <g key={market.outcomes[index]?.id ?? index}>
              <polyline
                fill="none"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
                points={toPoints(values)}
              />
              <circle cx={endPoint.x} cy={endPoint.y} r="7" fill={color} opacity="0.18" />
              <circle cx={endPoint.x} cy={endPoint.y} r="4" fill={color} stroke="rgba(255,255,255,0.72)" strokeWidth="1" />
            </g>
          );
        })}

        {hoveredIndex !== null ? (
          <g>
            <line
              x1={tooltipX}
              x2={tooltipX}
              y1={plot.top}
              y2={plot.top + plotHeight}
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1"
            />
            <text
              x={tooltipX}
              y={plot.top + 12}
              textAnchor="middle"
              fill="rgba(255,255,255,0.62)"
              fontSize="12"
              fontWeight="700"
            >
              {dateLabel}
            </text>
            {tooltipRows.map((row) => {
              return (
                <g key={`tooltip-${market.outcomes[row.index]?.id ?? row.index}`}>
                  <circle cx={tooltipX} cy={row.pointY} r="4" fill={row.color} stroke="rgba(255,255,255,0.82)" strokeWidth="1" />
                  {Math.abs(row.labelY - row.pointY) > 8 ? (
                    <line
                      x1={tooltipX}
                      x2={tooltipAnchor === 'start' ? tooltipLabelX : tooltipLabelX - 136}
                      y1={row.pointY}
                      y2={row.labelY}
                      stroke={row.color}
                      strokeWidth="1"
                      opacity="0.45"
                    />
                  ) : null}
                  <rect
                    x={tooltipAnchor === 'start' ? tooltipLabelX : tooltipLabelX - 136}
                    y={row.labelY - 13}
                    width="136"
                    height="24"
                    rx="7"
                    fill="rgba(5,8,22,0.94)"
                    stroke="rgba(255,255,255,0.14)"
                  />
                  <rect
                    x={tooltipAnchor === 'start' ? tooltipLabelX + 8 : tooltipLabelX - 128}
                    y={row.labelY - 5}
                    width="4"
                    height="10"
                    rx="2"
                    fill={row.color}
                  />
                  <text
                    x={tooltipAnchor === 'start' ? tooltipLabelX + 18 : tooltipLabelX - 118}
                    y={row.labelY + 4}
                    fill="rgba(255,255,255,0.88)"
                    fontSize="12"
                    fontWeight="800"
                  >
                    {row.label}
                  </text>
                </g>
              );
            })}
          </g>
        ) : null}

        <rect
          x={plot.left}
          y={plot.top}
          width={plotWidth}
          height={plotHeight}
          fill="transparent"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoveredIndex(null)}
        />
      </svg>
    </div>
  );
}
