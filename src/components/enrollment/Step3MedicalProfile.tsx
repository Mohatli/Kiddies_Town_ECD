import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EnrolmentFormValues } from './enrollmentSchemas';

export default function Step3MedicalProfile() {
  const { register } = useFormContext<EnrolmentFormValues>();

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-50 pb-2">
        <h3 className="text-sm font-extrabold text-indigo-950">3. Medical Profile & Emergencies</h3>
        <p className="text-[11px] text-slate-400 font-semibold">Important details to verify health and safety. Epipen guides and inhaler logs.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Family Doctor Name</label>
          <input
            type="text"
            {...register('step3.familyDoc')}
            placeholder="Dr. Melusi Khoza"
            className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Doctor Contact Phone</label>
          <input
            type="text"
            {...register('step3.docPhone')}
            placeholder="e.g. 015 023 1111"
            className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 font-mono focus:outline-hidden"
          />
        </div>
      </div>

      {/* Health checks list checkboxes */}
      <div className="p-4.5 border border-slate-150 rounded-2xl bg-slate-50/50 space-y-3">
        <h4 className="font-extrabold text-xs text-indigo-950 border-b pb-1 mb-2">Health Conditions</h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
            <input
              type="checkbox"
              {...register('step3.hasDiabetes')}
              className="w-4.5 h-4.5 accent-indigo-600 rounded"
            />
            <span>Diabetes</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
            <input
              type="checkbox"
              {...register('step3.hasAsthma')}
              className="w-4.5 h-4.5 accent-indigo-600 rounded"
            />
            <span>Asthma</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
            <input
              type="checkbox"
              {...register('step3.hasEpilepsy')}
              className="w-4.5 h-4.5 accent-indigo-600 rounded"
            />
            <span>Epilepsy</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
            <input
              type="checkbox"
              {...register('step3.hasMurmur')}
              className="w-4.5 h-4.5 accent-indigo-600 rounded"
            />
            <span>Cardiac Murmur</span>
          </label>
        </div>

        <div className="pt-3">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Life-Threatening Allergies</label>
          <input
            type="text"
            {...register('step3.allergiesText')}
            placeholder="e.g. Peanuts, Shellfish, Bees"
            className="bg-white border w-full px-3 py-2 rounded-xl text-slate-800 focus:outline-hidden font-semibold"
          />
        </div>
      </div>

      {/* Emergency consent */}
      <label className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 cursor-pointer select-none text-rose-900 mt-4 leading-relaxed font-semibold">
        <input
          type="checkbox"
          {...register('step3.emergencyConsent')}
          className="w-5 h-5 accent-rose-700 rounded mt-0.5 shrink-0"
        />
        <span className="text-xs">
          I/We hereby grant consent for emergency medical treatment by staff members if the family physician is unavailable.
        </span>
      </label>
    </div>
  );
}
