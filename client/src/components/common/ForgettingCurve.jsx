import { useMemo } from "react";
import { motion } from "framer-motion";

const WIDTH = 620;
const HEIGHT = 200;
const TOP_PAD = 20;
const PLOT_H = HEIGHT - TOP_PAD - 30;

// Each review's interval grows (SM-2's core behavior), and each review's
// decay gets slower too — since the ease factor improves as recall succeeds.
// This is the actual mechanism, not decoration.
const SEGMENTS = [
  { days: 1, decayRate: 1.1 }, // first review: fast forgetting
  { days: 3, decayRate: 0.55 },
  { days: 7, decayRate: 0.28 },
  { days: 14, decayRate: 0.14 }, // by now: much slower forgetting
];

const THRESHOLD = 0.4; // strength below which the item is "due"

function buildCurve() {
  const totalDays = SEGMENTS.reduce((sum, s) => sum + s.days, 0);
  const xScale = (WIDTH - 40) / totalDays;

  let cursorDay = 0;
  const points = [];
  const reviewMarkers = [];

  SEGMENTS.forEach((seg) => {
    const startX = 20 + cursorDay * xScale;
    reviewMarkers.push({ x: startX, day: cursorDay });

    // sample the exponential decay across this segment
    const steps = 24;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * seg.days;
      const strength = Math.exp(-seg.decayRate * t); // 1.0 -> decays toward 0
      const x = 20 + (cursorDay + t) * xScale;
      const y = TOP_PAD + (1 - strength) * PLOT_H;
      points.push([x, y]);
    }
    cursorDay += seg.days;
  });

  const pathD = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const thresholdY = TOP_PAD + THRESHOLD * PLOT_H;

  return { pathD, reviewMarkers, thresholdY, totalDays };
}

function ForgettingCurve() {
  const { pathD, reviewMarkers, thresholdY } = useMemo(buildCurve, []);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" role="img" aria-label="Memory strength decaying over time, reset upward at each spaced review">
      <defs>
        <linearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5EE6C5" />
          <stop offset="100%" stopColor="#FFB547" />
        </linearGradient>
      </defs>

      {/* forgetting threshold — the line that defines "due for review" */}
      <line x1="16" y1={thresholdY} x2={WIDTH - 16} y2={thresholdY} stroke="#9A8FB5" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
      <text x={WIDTH - 16} y={thresholdY - 7} textAnchor="end" fill="#9A8FB5" fontSize="10" fontFamily="Instrument Sans">
        review threshold
      </text>

      {/* the decay curve itself, drawn once on load */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#curveGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.4, ease: "easeInOut" }}
      />

      {/* vertical reset lines + dots at each review, timed to when the drawn curve reaches them */}
      {reviewMarkers.map((m, i) => (
        <g key={m.x}>
          {i > 0 && (
            <motion.line
              x1={m.x} x2={m.x} y1={TOP_PAD} y2={HEIGHT - 30}
              stroke="#2E2440" strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.55 }}
            />
          )}
          <motion.circle
            cx={m.x} cy={TOP_PAD} r="4.5" fill="#FFB547"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.55, type: "spring", stiffness: 300 }}
          />
          <text x={m.x} y={HEIGHT - 12} textAnchor="middle" fill="#9A8FB5" fontSize="10" fontFamily="Instrument Sans">
            day {m.day}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default ForgettingCurve;