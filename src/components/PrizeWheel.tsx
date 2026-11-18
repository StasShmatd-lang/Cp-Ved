import { useMemo } from 'react'
import { CRISES, SEGMENT_COLORS } from '../data/crises'

type Props = {
  rotation: number
  spinning: boolean
}

const SIZE = 520
const CX = SIZE / 2
const CY = SIZE / 2
const R = SIZE / 2 - 8
const INNER = 56
const N = CRISES.length
const SLICE = 360 / N

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

function slicePath(i: number) {
  const start = i * SLICE
  const end = (i + 1) * SLICE
  const p1 = polar(CX, CY, R, start)
  const p2 = polar(CX, CY, R, end)
  const large = SLICE > 180 ? 1 : 0
  return `M ${CX} ${CY} L ${p1.x} ${p1.y} A ${R} ${R} 0 ${large} 1 ${p2.x} ${p2.y} Z`
}

export function PrizeWheel({ rotation, spinning }: Props) {
  const labels = useMemo(
    () =>
      CRISES.map((c, i) => {
        const mid = i * SLICE + SLICE / 2
        return { ...c, mid, color: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }
      }),
    [],
  )

  return (
    <div className={`wheel-stage ${spinning ? 'is-spinning' : ''}`}>
      <div className="wheel-glow" aria-hidden />
      <div className="wheel-pointer" aria-hidden>
        <span />
      </div>
      <svg
        className="wheel-svg"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width="100%"
        height="100%"
        style={{ transform: `rotate(${rotation}deg)` }}
        role="img"
        aria-label="Кризис-лототрон"
      >
        <defs>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.45" />
          </filter>
          <radialGradient id="hubGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#2a3340" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
        </defs>
        <g filter="url(#softShadow)">
          {CRISES.map((_, i) => (
            <path
              key={i}
              d={slicePath(i)}
              fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
              stroke="#0a0d12"
              strokeWidth="2.5"
            />
          ))}
        </g>
        {labels.map((l) => (
          <g key={l.id} transform={`rotate(${l.mid} ${CX} ${CY})`}>
            <text
              x={CX}
              y={CY - R * 0.68}
              textAnchor="middle"
              className="wheel-label"
              fill="#0a0d12"
              fontSize="15"
              fontWeight="700"
              letterSpacing="0.02em"
            >
              {l.short}
            </text>
          </g>
        ))}
        <circle cx={CX} cy={CY} r={INNER} fill="url(#hubGrad)" stroke="#FF6B5A" strokeWidth="3" />
        <circle cx={CX} cy={CY} r={INNER - 10} fill="none" stroke="#C8F54A" strokeWidth="1.5" opacity="0.7" />
        <text
          x={CX}
          y={CY + 5}
          textAnchor="middle"
          fill="#7EE7F2"
          fontSize="13"
          fontWeight="800"
          letterSpacing="0.12em"
          className="wheel-hub-text"
        >
          ЧП
        </text>
      </svg>
      <div className="wheel-rim" aria-hidden />
    </div>
  )
}
