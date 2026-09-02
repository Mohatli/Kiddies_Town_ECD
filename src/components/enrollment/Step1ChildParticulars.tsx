import React, { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { EnrolmentFormValues } from './enrollmentSchemas';
import FieldError from './FieldError';

export default function Step1ChildParticulars() {
  const { register, setValue, formState: { errors } } = useFormContext<EnrolmentFormValues>();
  const step1Errors = errors.step1;

  const dob = useWatch({ name: 'step1.dob' });
  const systemClass = useWatch({ name: 'step1.systemClass' });

  // Dynamically assign class based on age derived from DOB
  useEffect(() => {
    if (!dob) {
      setValue('step1.systemClass', 'N/A');
      return;
    }
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    const estAge = currentYear - birthYear;

    if (estAge <= 3) {
      setValue('step1.systemClass', 'Roses');
    } else if (estAge === 4) {
      setValue('step1.systemClass', 'Giraffes');
    } else {
      setValue('step1.systemClass', 'Tigers');
    }
  }, [dob, setValue]);

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-50 pb-2">
        <h3 className="text-sm font-extrabold text-indigo-950">1. Child Particulars</h3>
        <p className="text-[11px] text-slate-400 font-semibold">Allocates class type automatically based on derived birthday age.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Enrolment Type</label>
          <select
            {...register('step1.enrolmentType')}
            className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
          >
            <option value="New Enrolment">New Enrolment</option>
            <option value="Re-Enrolment">Re-Enrolment / Transfer</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Care Required</label>
          <select
            {...register('step1.careRequired')}
            className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
          >
            <option value="Full Day">Full Day program (R2,500/mo)</option>
            <option value="Half Day">Half Day program (R2,200/mo to 13:00)</option>
            <option value="Aftercare Only">Aftercare Only (R950/mo with snacks)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">First Names (As birth certificate)</label>
          <input
            type="text"
            {...register('step1.firstNames')}
            placeholder="e.g. Leo Thabo"
            aria-invalid={!!step1Errors?.firstNames}
            className={`bg-slate-50 w-full px-3 py-2.5 border rounded-xl text-slate-800 focus:outline-hidden ${
              step1Errors?.firstNames ? 'border-red-400' : 'border-slate-200'
            }`}
          />
          <FieldError name="step1.firstNames" />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Surname / Family Surname</label>
          <input
            type="text"
            {...register('step1.surname')}
            placeholder="Mbeki"
            aria-invalid={!!step1Errors?.surname}
            className={`bg-slate-50 w-full px-3 py-2.5 border rounded-xl text-slate-800 focus:outline-hidden ${
              step1Errors?.surname ? 'border-red-400' : 'border-slate-200'
            }`}
          />
          <FieldError name="step1.surname" />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Preferred Name / Nickname</label>
          <input
            type="text"
            {...register('step1.prefName')}
            placeholder="What should we call the child?"
            className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Birth</label>
          <input
            type="date"
            {...register('step1.dob')}
            aria-invalid={!!step1Errors?.dob}
            className={`bg-slate-50 w-full px-3 py-2.5 border rounded-xl text-slate-800 font-mono focus:outline-hidden ${
              step1Errors?.dob ? 'border-red-400' : 'border-slate-200'
            }`}
          />
          <FieldError name="step1.dob" />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Child ID Number / Passport</label>
          <input
            type="text"
            {...register('step1.idNumber')}
            placeholder="13-digit National ID"
            className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 font-mono focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Gender</label>
          <select
            {...register('step1.gender')}
            className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Home Language</label>
          <input
            type="text"
            {...register('step1.language')}
            placeholder="e.g. Setswana / English"
            aria-invalid={!!step1Errors?.language}
            className={`bg-slate-50 w-full px-3 py-2.5 border rounded-xl text-slate-800 focus:outline-hidden ${
              step1Errors?.language ? 'border-red-400' : 'border-slate-200'
            }`}
          />
          <FieldError name="step1.language" />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Religion</label>
          <input
            type="text"
            {...register('step1.religion')}
            placeholder="e.g. None / Christian"
            className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Class assignment preview block */}
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between gap-4 mt-6">
        <div>
          <p className="font-bold text-indigo-950 text-xs">Derived System Class Assignment</p>
          <p className="text-[11px] mt-0.5 text-indigo-600 font-semibold font-mono">
            {systemClass === 'N/A' || !systemClass ? 'Awaiting Date of Birth...' : `Allocated: ${systemClass} Class Group`}
          </p>
        </div>
        <span className="text-2xl">
          {systemClass === 'Roses' ? '🌹' : systemClass === 'Giraffes' ? '🦒' : systemClass === 'Tigers' ? '🐯' : '👶'}
        </span>
      </div>
    </div>
  );
}
