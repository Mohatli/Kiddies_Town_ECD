import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { motion } from 'motion/react';
import { EnrolmentFormValues } from './enrollmentSchemas';

export default function Step4TransportDetails() {
  const { register } = useFormContext<EnrolmentFormValues>();
  const isTransportNeeded = useWatch({ name: 'step4.isTransportNeeded' });

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-50 pb-2">
        <h3 className="text-sm font-extrabold text-indigo-950">4. Pickup Logistics & Transport</h3>
        <p className="text-[11px] text-slate-400 font-semibold">Select if you need of the Kiddies Town shuttle service (Arranged CBD/Ster Park pick ups).</p>
      </div>

      {/* Transport need trigger */}
      <div className="p-4.5 border rounded-2xl space-y-3.5 bg-slate-50/50">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-extrabold text-indigo-950 select-none">
          <input
            type="checkbox"
            {...register('step4.isTransportNeeded')}
            className="w-5 h-5 accent-indigo-600 rounded"
          />
          <span>Transport Service Needed? (Weekly pick-ups)</span>
        </label>

        {isTransportNeeded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200/50"
          >
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pick-up Zone / Point</label>
              <input
                type="text"
                {...register('step4.pickUpPoint')}
                placeholder="e.g. 15 Hospital Road"
                className="bg-white border w-full px-3 py-2 rounded-xl text-slate-800 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Desired Pick-up Time</label>
              <input
                type="text"
                {...register('step4.pickUpTime')}
                placeholder="07:00 AM"
                className="bg-white border w-full px-3 py-2 rounded-xl text-slate-808 font-mono focus:outline-hidden"
              />
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Who will drop off child?</label>
          <input
            type="text"
            {...register('step4.dropOffPerson')}
            placeholder="e.g. Mother"
            className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-808 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Who will collect child?</label>
          <input
            type="text"
            {...register('step4.collectPerson')}
            placeholder="e.g. Uncle Thabo"
            className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-808 focus:outline-hidden"
          />
        </div>
      </div>
    </div>
  );
}
