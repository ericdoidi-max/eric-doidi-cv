import React, { useEffect, useState } from 'react';
import { Activity, Wifi, Battery, Server } from 'lucide-react';

const SystemStatus: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-white border-b border-slate-200 p-2 flex justify-between items-center text-xs font-mono text-slate-500 select-none shadow-sm z-10">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 text-blue-600">
          <Server size={14} />
          <span className="font-bold">SYSTEM: ONLINE</span>
        </div>
        <div className="flex items-center space-x-1 text-emerald-600">
          <Wifi size={14} />
          <span className="font-bold">CONN: SECURE</span>
        </div>
        <div className="hidden md:flex items-center space-x-1 text-slate-400 animate-pulse">
          <Activity size={14} />
          <span>MONITORING ACTIVE</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-slate-600">
        <div className="flex items-center space-x-1">
          <Battery size={14} />
          <span>PWR: 100%</span>
        </div>
        <div className="font-bold">
          {time.toLocaleTimeString('fr-FR', { hour12: false })}
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;