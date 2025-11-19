import React from 'react';
import { SKILLS, EDUCATION, HOBBIES } from '../../constants';
import { Cpu, BookOpen, Heart, Star } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const SpecsView: React.FC = () => {
  const radarData = SKILLS.map(s => ({ subject: s.category, A: s.level, fullMark: 100 }));

  return (
    <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Skills Section */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-6 border-b border-slate-100 pb-2">
                    <Cpu className="text-blue-600 mr-2" />
                    <h3 className="text-lg font-bold text-slate-800 font-mono">MATRICE DE COMPÉTENCES</h3>
                </div>
                
                <div className="h-64 w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                                name="Eric"
                                dataKey="A"
                                stroke="#2563eb"
                                strokeWidth={3}
                                fill="#3b82f6"
                                fillOpacity={0.2}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                    {SKILLS.map((skill) => (
                        <div key={skill.category}>
                            <div className="flex justify-between text-xs font-mono text-slate-500 mb-1 font-bold">
                                <span>{skill.category}</span>
                                <span className="text-blue-600">{skill.level}% EXPERTISE</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${skill.level}%` }}></div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {skill.items.map(item => (
                                    <span key={item} className="text-[10px] px-2 py-1 bg-slate-50 text-slate-600 rounded border border-slate-200 font-medium">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                {/* Education Section */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4 border-b border-slate-100 pb-2">
                        <BookOpen className="text-purple-500 mr-2" />
                        <h3 className="text-lg font-bold text-slate-800 font-mono">FORMATION</h3>
                    </div>
                    <div className="space-y-5">
                        {EDUCATION.map((edu, idx) => (
                            <div key={idx} className="flex items-start space-x-3 group">
                                <div className="mt-1.5">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:ring-2 ring-purple-200 transition-all"></div>
                                </div>
                                <div>
                                    <div className="text-slate-800 font-bold text-sm">{edu.title}</div>
                                    <div className="text-purple-600 font-mono text-xs font-medium">{edu.institution} | {edu.year}</div>
                                    {edu.details && <div className="text-slate-500 text-xs mt-1 italic">{edu.details}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hobbies Section */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                     <div className="flex items-center mb-4 border-b border-slate-100 pb-2">
                        <Heart className="text-rose-500 mr-2" />
                        <h3 className="text-lg font-bold text-slate-800 font-mono">LOISIRS</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {HOBBIES.map(hobby => (
                            <div key={hobby} className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700 font-medium hover:bg-white hover:shadow-sm transition-all">
                                <Star size={14} className="text-rose-500 mr-2" />
                                {hobby}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SpecsView;