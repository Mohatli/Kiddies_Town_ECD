import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck } from 'lucide-react';
import { Learner } from '../../types';

export interface TransportRouteModalProps {
  selectedTransportLearner: Learner | null;
  setSelectedTransportLearner: (learner: Learner | null) => void;
  transportRoutes: any[];
  onUpdateLearner?: (learner: Learner) => void;
}

export default function TransportRouteModal({
  selectedTransportLearner,
  setSelectedTransportLearner,
  transportRoutes,
  onUpdateLearner
}: TransportRouteModalProps) {
  if (!selectedTransportLearner) return null;

  const student = selectedTransportLearner;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl border border-slate-205 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-sm tracking-tight uppercase">Assign Transport Route</h3>
                <p className="text-xs text-slate-400 font-semibold">{student.firstNames} {student.surname} ({student.classType} Room)</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedTransportLearner(null)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-xs font-bold"
            >
              ✕ Close
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              Select an active transport route run for <strong>{student.firstNames}</strong>. Assigning a route updates the student profile and notifies the driver of a new passenger.
            </p>

            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Select Transport Route</label>
              <div className="space-y-2">
                {/* Unassigned Option */}
                <div 
                  onClick={() => {
                    const updated: Learner = {
                      ...student,
                      transportRouteId: undefined,
                      transportRouteName: undefined,
                      transportNeeded: false
                    };
                    if (onUpdateLearner) {
                      onUpdateLearner(updated);
                    }
                    setSelectedTransportLearner(null);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    !student.transportRouteId 
                      ? 'bg-indigo-50/40 border-indigo-200 ring-2 ring-indigo-500/10' 
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    !student.transportRouteId ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                  }`}>
                    {!student.transportRouteId && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">No Transport / Self-arranged</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Student is picked up/dropped off by parents or private transport.</p>
                  </div>
                </div>

                {/* Routes from state */}
                {transportRoutes.map((route) => {
                  const isSelected = student.transportRouteId === route.id;
                  return (
                    <div 
                      key={route.id}
                      onClick={() => {
                        const updated: Learner = {
                          ...student,
                          transportRouteId: route.id,
                          transportRouteName: route.name,
                          transportNeeded: true
                        };
                        if (onUpdateLearner) {
                          onUpdateLearner(updated);
                        }
                        setSelectedTransportLearner(null);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected 
                          ? 'bg-indigo-50/40 border-indigo-200 ring-2 ring-indigo-500/10' 
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-extrabold text-slate-800">{route.name}</p>
                        <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100">
                          <div>
                            <span className="text-slate-400 block text-[8px] uppercase font-bold">Driver</span>
                            <span className="font-semibold text-slate-700">{route.driver}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[8px] uppercase font-bold">Vehicle</span>
                            <span className="font-semibold text-slate-700">{route.vehicle}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-400 block text-[8px] uppercase font-bold mt-1">Route Stops</span>
                            <span className="font-semibold text-slate-700 leading-tight block">{route.stops.join(" ➔ ")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
