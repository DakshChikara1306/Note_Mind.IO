import React from 'react'
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts"

function RechartSetUp({ charts }) {
  if (!charts || charts.length === 0) return null;
  
  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md border border-zinc-200 px-3.5 py-2 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] font-sans">
          <p className="text-xs font-bold text-zinc-500 mb-0.5 tracking-wide uppercase">
            {payload[0].payload.name}
          </p>
          <p className="text-sm font-extrabold text-zinc-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
            Value: <span className="font-black text-indigo-600">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='space-y-6'>
      {charts.map((chart, index) => (
        <div key={index} className='border border-zinc-100 rounded-2xl p-5 bg-zinc-50/50 shadow-xs transition-all hover:bg-zinc-50/80 duration-300'>
          
          <h4 className='text-[11px] font-extrabold uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2 px-1'>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
            {chart.title}
          </h4>

          {/* Canvas Wrapper */}
          <div className='h-80 w-full text-[11px] font-bold text-zinc-400 font-sans tracking-wide select-none'>
            <ResponsiveContainer width="100%" height="100%">
              
              {chart.type === "bar" && (
                /* 💥 FIX 1: Flipped layout to "vertical". Set explicit left margin to 140px to give long text plenty of horizontal room */
                <BarChart 
                  layout="vertical" 
                  data={chart.data} 
                  margin={{ top: 10, right: 20, left: 140, bottom: 10 }}
                >
                  {/* 💥 FIX 2: Swapped vertical grid lines instead of horizontal lines */}
                  <CartesianGrid strokeDasharray="4 4" stroke="#e4e4e7" horizontal={false} />
                  
                  {/* 💥 FIX 3: In horizontal charts, X-Axis displays values, and Y-Axis holds the text categories */}
                  <XAxis 
                    type="number"
                    stroke="#a1a1aa" 
                    tickLine={false} 
                    axisLine={false} 
                    dy={5}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name" 
                    stroke="#4b5563" 
                    tickLine={false} 
                    axisLine={false} 
                    dx={-10}
                    width={130}
                  />
                  <Tooltip cursor={{ fill: '#f4f4f5', opacity: 0.6 }} content={<CustomTooltip />} />
                  
                  {/* 💥 FIX 4: Assigned dataKey to XAxis tracking, set explicit bar metrics, and applied rounded corner radiuses rightwards */}
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={24}>
                    {chart.data.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} className="transition-all duration-300 hover:opacity-85" />
                    ))}
                  </Bar>
                </BarChart>
              )}

              {chart.type === "line" && (
                <LineChart data={chart.data} margin={{ top: 5, right: 15, left: -20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e4e4e7" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#a1a1aa" 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10} 
                    interval={0}
                  />
                  <YAxis 
                    stroke="#a1a1aa" 
                    tickLine={false} 
                    axisLine={false} 
                    dx={-5} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone"
                    dataKey="value"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: "#ffffff", stroke: "#4f46e5" }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#4f46e5" }}
                  />
                </LineChart>
              )}

              {chart.type === "pie" && (
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie 
                    data={chart.data}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={85}
                    innerRadius={55}
                    paddingAngle={4}
                    label={{ fontSize: 10, fontWeight: 700, fill: '#71717a', letterSpacing: '0.05em' }}
                  >
                    {chart.data.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} className="transition-all duration-300 hover:opacity-85 focus:outline-none" />
                    ))}
                  </Pie>
                </PieChart>
              )}

            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RechartSetUp