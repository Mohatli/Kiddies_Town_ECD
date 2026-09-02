import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EnrolmentFormValues } from './enrollmentSchemas';
import FieldError from './FieldError';

export default function Step2ParentDetails() {
  const { register } = useFormContext<EnrolmentFormValues>();

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-50 pb-2">
        <h3 className="text-sm font-extrabold text-indigo-950">2. Parent / Guardian Particulars</h3>
        <p className="text-[11px] text-slate-400 font-semibold">Emergency point information required for background. Both parents if applicable.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Marital Status of Parents</label>
          <input
            type="text"
            {...register('step2.maritalStatus')}
            placeholder="e.g. Married, Single, Divorced"
            className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Child Lives With</label>
          <input
            type="text"
            {...register('step2.childLivesWith')}
            placeholder="e.g. Both Parents, Mother"
            className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Mother particulars block */}
      <div className="border border-slate-150 rounded-2xl p-4.5 bg-slate-50/50">
        <h4 className="font-extrabold text-xs text-indigo-950 mb-3 border-b pb-1">Mother's Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">First Names</label>
            <input
              type="text"
              {...register('step2.mName')}
              className="bg-white border w-full px-2.5 py-1.5 rounded-lg text-slate-800 focus:outline-hidden"
            />
            <FieldError name="step2.mName" />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Surname</label>
            <input
              type="text"
              {...register('step2.mSurname')}
              className="bg-white border w-full px-2.5 py-1.5 rounded-lg text-slate-800 focus:outline-hidden"
            />
            <FieldError name="step2.mSurname" />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Cell Number</label>
            <input
              type="text"
              {...register('step2.mCell')}
              placeholder="e.g. 081 545 3500"
              className="bg-white border w-full px-2.5 py-1.5 rounded-lg text-slate-800 font-mono focus:outline-hidden"
            />
            <FieldError name="step2.mCell" />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">National ID Number</label>
            <input
              type="text"
              {...register('step2.mId')}
              className="bg-white border w-full px-2.5 py-1.5 rounded-lg text-slate-800 font-mono focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email Address</label>
            <input
              type="email"
              {...register('step2.mEmail')}
              className="bg-white border w-full px-2.5 py-1.5 rounded-lg text-slate-800 focus:outline-hidden"
            />
            <FieldError name="step2.mEmail" />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Employer / Work Company</label>
            <input
              type="text"
              {...register('step2.mEmp')}
              className="bg-white border w-full px-2.5 py-1.5 rounded-lg text-slate-800 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Residential Address */}
      <div>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Residential Physical Address</label>
        <input
          type="text"
          {...register('step2.address')}
          placeholder="e.g. 7 Grimm Street, Ster Park, Polokwane"
          className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden"
        />
        <FieldError name="step2.address" />
      </div>
    </div>
  );
}
