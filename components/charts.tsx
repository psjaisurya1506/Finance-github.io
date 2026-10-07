export function Sparkline({ data, up, w = 96, h = 32 }: { data: number[]; up: boolean; w?: number; h?: number }) {
  const max = Math.max(...data), min = Math.min(...data)
  const d = data.map((v, i) => `${i ? 'L' : 'M'}${((i / (data.length - 1)) * w).toFixed(1)},${(h - 3 - ((v - min) / (max - min || 1)) * (h - 6)).toFixed(1)}`).join(' ')
  return <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true"><path d={d} fill="none" stroke={up ? '#3ddc97' : '#f26d6d'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export function Donut({ parts, size = 168, center }: { parts: { value: number; color: string; label: string }[]; size?: number; center?: React.ReactNode }) {
  const total = parts.reduce((a, p) => a + p.value, 0)
  const r = 54, c = 2 * Math.PI * r
  const offsets = parts.map((_, i) => parts.slice(0, i).reduce((a, q) => a + (q.value / total) * c, 0))
  return <div className="relative" style={{ width: size, height: size }}>
    <svg viewBox="0 0 140 140" width={size} height={size} role="img" aria-label="Allocation donut chart" className="-rotate-90">
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="16" />
      {parts.map((p, i) => { const len = Math.max((p.value / total) * c - 2, 0); return <circle key={p.label} cx="70" cy="70" r={r} fill="none" stroke={p.color} strokeWidth="16" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offsets[i]} /> })}
    </svg>
    {center && <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{center}</div>}
  </div>
}

/** Stacked bars: invested (bottom) + gains (top) per year */
export function StackedBars({ data }: { data: { label: string; a: number; b: number }[] }) {
  const w = 560, h = 190, pad = 6
  const max = Math.max(...data.map(d => d.a + d.b), 1)
  const bw = (w - pad * 2) / data.length
  return <svg viewBox={`0 0 ${w} ${h + 18}`} className="w-full" role="img" aria-label="Growth by year, invested amount and returns">
    {[0.25, 0.5, 0.75].map(f => <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="rgba(245,240,227,.06)" />)}
    {data.map((d, i) => { const ha = (d.a / max) * h, hb = (d.b / max) * h, x = pad + i * bw + bw * 0.14, bww = bw * 0.72
      return <g key={i}><rect x={x} y={h - ha} width={bww} height={ha} fill="#3ddc97" opacity=".85" rx="2" /><rect x={x} y={h - ha - hb} width={bww} height={hb} fill="#e4b95e" rx="2" />
        {(data.length <= 12 || i % Math.ceil(data.length / 10) === 0) && <text x={x + bww / 2} y={h + 14} textAnchor="middle" fontSize="10" fill="#6b8077">{d.label}</text>}</g> })}
  </svg>
}

export function AreaLine({ data, labels, height = 150 }: { data: number[]; labels?: string[]; height?: number }) {
  const w = 520, h = height
  const max = Math.max(...data), min = Math.min(...data) * 0.97
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / (max - min || 1)) * (h - 20) - 8])
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  return <svg viewBox={`0 0 ${w} ${h + 18}`} className="w-full" role="img" aria-label="Trend chart">
    <defs><linearGradient id="al" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#e4b95e" stopOpacity=".32" /><stop offset="1" stopColor="#e4b95e" stopOpacity="0" /></linearGradient></defs>
    {[0.25, 0.5, 0.75].map(f => <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="rgba(245,240,227,.06)" />)}
    <path d={`${line} L${w},${h} L0,${h} Z`} fill="url(#al)" /><path d={line} fill="none" stroke="#e4b95e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4.5" fill="#3ddc97" />
    {labels && labels.map((l, i) => i % 2 === 0 && <text key={l} x={(i / (labels.length - 1)) * w} y={h + 14} textAnchor={i === 0 ? 'start' : 'middle'} fontSize="10" fill="#6b8077">{l}</text>)}
  </svg>
}
