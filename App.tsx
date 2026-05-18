import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import SystemStatus from './components/SystemStatus';
import DashboardView from './components/views/DashboardView';
import LogsView from './components/views/LogsView';
import SpecsView from './components/views/SpecsView';
import CommView from './components/views/CommView';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <DashboardView onChangeView={setCurrentView} />;
      case ViewState.LOGS:
        return <LogsView />;
      case ViewState.SPECS:
        return <SpecsView />;
      case ViewState.COMMUNICATION:
        return <CommView />;
      default:
        return <DashboardView onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen w-full bg-slate-50 text-slate-800 font-sans md:overflow-hidden">
      {/* Sidebar scrolls naturally on mobile, fixed on desktop */}
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 h-full">
        <SystemStatus />
        
        <div className="flex-1 p-4 md:p-8 relative md:overflow-y-auto">
          {/* Background Grid Effect - Light Version */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto relative z-10 pb-10 md:pb-0">
            {renderView()}
          </div>
        </div>
      </main>

      {/* Global Style for Animations */}
      <style>{`
        @keyframes scanline {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        .animate-scanline {
          animation: scanline 3s linear infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;