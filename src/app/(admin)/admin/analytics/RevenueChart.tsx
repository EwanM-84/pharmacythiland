"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DailyStat {
  date: string;
  revenue: number;
  cogs: number;
}

export function RevenueChart({ data }: { data: DailyStat[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="cogsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#6b7280" }}
          tickFormatter={(v) => v.slice(5)}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#6b7280" }}
          tickFormatter={(v) => `฿${(v / 1000).toFixed(0)}k`}
          width={55}
        />
        <Tooltip
          formatter={(value, name) => [
            `฿${Number(value).toLocaleString()}`,
            name === "revenue" ? "Revenue" : "COGS",
          ]}
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            fontSize: "13px",
          }}
        />
        <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={2} fill="url(#revenueGrad)" />
        <Area type="monotone" dataKey="cogs" stroke="#f59e0b" strokeWidth={2} fill="url(#cogsGrad)" strokeDasharray="4 4" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
