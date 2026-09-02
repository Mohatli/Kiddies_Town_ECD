import React from 'react';
import { Truck, MapPin, Search } from 'lucide-react';

export interface TransportManagerProps {
  transportRoutes: any[];
}

export default function TransportManager({ transportRoutes }: TransportManagerProps) {
  return (
    <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
        <div>
          <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-600" />
            Transport Fleet & Routes
          </h3>
          <p className="text-xs text-slate-500 mt-1">Manage school transportation, active routes, and assigned drivers.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search routes..."
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-indigo-400 w-48"
            />
          </div>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm">
            + New Route
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {transportRoutes.map(route => (
          <div key={route.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover-lift flex flex-col">
            {/* Route Header Map placeholder */}
            <div className="h-32 bg-slate-100 relative w-full border-b border-slate-200/80 flex items-center justify-center overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
              
              {/* Animated decorative route line */}
              <svg className="absolute w-full h-full" preserveAspectRatio="none">
                <path d="M-50,80 Q100,20 200,80 T450,80" fill="none" stroke="#4f46e5" strokeWidth="4" strokeDasharray="10 10" strokeLinecap="round" className="opacity-40" />
                <path d="M-50,80 Q100,20 200,80 T450,80" fill="none" stroke="#4f46e5" strokeWidth="4" className="opacity-20 animate-pulse" />
              </svg>
              
              <div className="relative z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-white flex items-center gap-2 group-hover:scale-105 transition-transform">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">{route.name}</span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-black text-slate-800 text-sm">Zone: {route.zone}</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Capacity: <span className="font-bold text-slate-700">{route.capacity} seats</span></p>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                  route.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                  {route.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Assigned Driver</span>
                  <span className="text-xs font-bold text-slate-700">{route.driver}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Vehicle Reg</span>
                  <span className="text-xs font-mono font-bold text-slate-700">{route.vehicle}</span>
                </div>
              </div>

              <div className="mt-auto">
                <h5 className="text-[10px] uppercase font-black text-slate-400 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Scheduled Stops
                </h5>
                <div className="relative pl-3 space-y-3 before:absolute before:inset-y-1 before:left-[5px] before:w-px before:bg-slate-200">
                  {route.stops.map((stop: string, i: number) => (
                    <div key={i} className="relative text-xs font-semibold text-slate-600 pl-3">
                      <div className="absolute left-[-11px] top-1.5 w-2 h-2 rounded-full bg-white border-2 border-indigo-400"></div>
                      {stop}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500">Currently assigned: {Math.floor(route.capacity * 0.8)} learners</span>
              <button className="text-[10px] font-black uppercase tracking-wider text-indigo-600 hover:text-indigo-800 transition-colors">Edit Route</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
