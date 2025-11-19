import React from 'react';
import { EXPERIENCES, SKILLS, BIO_SUMMARY } from '../../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Users, Briefcase, DollarSign } from 'lucide-react';

const DashboardView: React.FC = () => {
  // Aggregate KPIs manually for the dashboard
  const kpis = [
    { title: "Budget Géré Max", value: "4 M€", icon: DollarSign, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "Satisfaction Client", value: "8.4/10", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "Équipes Gérées", value: "Multiple", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Expérience", value: "+15 Ans", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  const skillData = SKILLS.map(s => ({ name: s.category, value: s.level }));
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']; // Brighter, standard colors

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Section */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 text-slate-900">
           <Briefcase size={120} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 font-mono">RAPPORT DE SYNTHÈSE</h2>
        <p className="text-slate-600 max-w-2xl leading-relaxed">{BIO_SUMMARY}</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-slate-500 text-xs font-mono uppercase font-bold">{kpi.title}</span>
                        <div className={`p-1.5 rounded-lg ${kpi.bg}`}>
                            <Icon size={16} className={kpi.color} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 font-mono">{kpi.value}</div>
                </div>
            )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Skill Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold font-mono text-blue-600 mb-4 border-b border-slate-100 pb-2">DISTRIBUTION DES COMPÉTENCES</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={skillData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {skillData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#1e293b' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                {skillData.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index] }}></div>
                        <span className="text-slate-600 font-medium">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Experience Timeline Chart (Simplified representation) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold font-mono text-blue-600 mb-4 border-b border-slate-100 pb-2">ÉVOLUTION RESPONSABILITÉS</h3>
            <div className="h-64 w-full flex items-center justify-center text-slate-500 text-sm font-mono relative">
                 {/* Simple Visual Timeline using CSS/Flex instead of complex graph for simplicity */}
                 <div className="w-full h-full flex flex-col justify-between py-2">
                    {EXPERIENCES.slice(0, 4).map((exp, i) => (
                        <div key={exp.id} className="flex items-center space-x-4 group">
                            <div className="w-16 text-right text-xs text-slate-500 font-bold font-mono">{exp.period.split(' ')[0]}</div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                                <div 
                                    className="h-full bg-blue-500/80 group-hover:bg-blue-600 transition-all duration-500" 
                                    style={{ width: `${100 - (i * 20)}%` }}
                                ></div>
                            </div>
                            <div className="w-32 text-xs truncate text-slate-700 font-medium">{exp.role}</div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;