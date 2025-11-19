import React from 'react';
import { EXPERIENCES } from '../../constants';
import { Terminal, Calendar } from 'lucide-react';

const LogsView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-800 font-mono flex items-center">
                <Terminal className="mr-2 text-blue-600" /> 
                HISTORIQUE OPÉRATIONNEL
            </h2>
            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">LOG_ID: EXP_FULL</span>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
            {EXPERIENCES.map((exp, index) => (
                <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    
                    {/* Icon Marker */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-slate-50 bg-white shadow-sm group-hover:border-blue-500 transition-all shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                       <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 font-mono">{2023 - index * 3}</span>
                    </div>
                    
                    {/* Content Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                        <div className="flex flex-col mb-2">
                            <span className="font-bold text-lg text-slate-800">{exp.role}</span>
                            <div className="flex items-center text-sm text-blue-600 font-mono mt-1 font-semibold">
                                <span>{exp.company}</span>
                                {exp.context && <span className="ml-2 text-slate-500 text-xs font-normal">[{exp.context}]</span>}
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-slate-500 mb-4 border-b border-slate-100 pb-2">
                            <div className="flex items-center">
                                <Calendar size={12} className="mr-1" />
                                {exp.period}
                            </div>
                        </div>

                        <ul className="space-y-2 mb-4">
                            {exp.details.map((detail, i) => (
                                <li key={i} className="text-sm text-slate-600 flex items-start">
                                    <span className="mr-2 text-blue-500 font-bold">›</span>
                                    {detail}
                                </li>
                            ))}
                        </ul>

                        {exp.kpis && (
                            <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                {exp.kpis.map((kpi, i) => (
                                    <div key={i}>
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{kpi.label}</div>
                                        <div className="text-sm font-mono font-bold text-emerald-600">{kpi.value}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 mt-4">
                            {exp.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-md font-mono font-medium border border-slate-200">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default LogsView;