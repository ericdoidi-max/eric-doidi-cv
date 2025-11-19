import React, { useState } from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, ClipboardList, Cpu, MessageSquare, UserCircle } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const [imgError, setImgError] = useState(false);
  
  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'VUE GLOBALE', icon: LayoutDashboard },
    { id: ViewState.LOGS, label: 'HISTORIQUE OP.', icon: ClipboardList },
    { id: ViewState.SPECS, label: 'SPÉCIFICATIONS', icon: Cpu },
    { id: ViewState.COMMUNICATION, label: 'COMM / IA', icon: MessageSquare },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col h-auto md:h-full shadow-sm z-20">
      <div className="p-6 border-b border-slate-100 flex flex-col items-center bg-slate-50/50">
        <div className={`w-32 h-32 rounded-full border-4 border-white shadow-md flex items-center justify-center mb-3 relative overflow-hidden group ring-1 ring-slate-200 ${imgError ? 'bg-slate-100' : 'bg-white'}`}>
           {!imgError ? (
             <img 
               src="/eric-profile.jpg" 
               alt="Eric Doidi" 
               className="w-full h-full object-cover"
               onError={() => setImgError(true)}
             />
           ) : (
             <div className="flex flex-col items-center justify-center text-slate-300">
                <UserCircle size={64} strokeWidth={1.5} />
             </div>
           )}
        </div>
        <h1 className="text-xl font-bold text-slate-800 font-mono tracking-wider">ERIC DOIDI</h1>
        <p className="text-xs text-blue-600 font-mono mt-1 text-center font-bold">UNITÉ RESPONSABLE</p>
        <div className="mt-2 px-2 py-1 bg-emerald-100 border border-emerald-200 rounded text-emerald-700 text-[10px] font-bold">
          STATUS: OPEN TO WORK
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-50 border border-blue-100 text-blue-700 shadow-sm' 
                  : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800 border border-transparent'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
              <span className="font-mono text-sm font-bold">{item.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 text-xs text-slate-400 font-mono text-center bg-slate-50/50">
        SYS.VER.2.0.24 <br/> MAINT. & SERVICES
      </div>
    </aside>
  );
};

export default Sidebar;