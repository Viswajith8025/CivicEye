import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function TrendChart({ data, color = "#0d9488" }) {
  if (!data?.length) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-slate-400">
        Not enough data yet
      </div>
    );
  }

  const formatted = data.map((d) => ({
    date: d._id?.slice(5) || d.date,
    count: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={formatted}>
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
        <Tooltip />
        <Area type="monotone" dataKey="count" stroke={color} fill="url(#trendGrad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
