import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { UploadCloud, Check } from 'lucide-react';
import { EnrolmentFormValues } from './enrollmentSchemas';

export default function Step6DocumentUpload() {
  const { register, setValue } = useFormContext<EnrolmentFormValues>();

  const uploadedBirth = useWatch({ name: 'step6.uploadedBirth' });
  const uploadedImmun = useWatch({ name: 'step6.uploadedImmun' });
  const uploadedIds = useWatch({ name: 'step6.uploadedIds' });
  const uploadedResidence = useWatch({ name: 'step6.uploadedResidence' });

  const firstNames = useWatch({ name: 'step1.firstNames' });
  const surname = useWatch({ name: 'step1.surname' });
  const systemClass = useWatch({ name: 'step1.systemClass' });
  const idNumber = useWatch({ name: 'step1.idNumber' });
  const signerName = useWatch({ name: 'step5.signerName' });

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-50 pb-2">
        <h3 className="text-sm font-extrabold text-indigo-950">6. Required Document Uploads & Review</h3>
        <p className="text-[11px] text-slate-400 font-semibold">Please upload certified copies to complete the registration review cycle.</p>
      </div>

      {/* Upload grid boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {[
          { field: 'step6.uploadedBirth' as const, state: uploadedBirth, label: "Child's Birth Certificate", file: 'birth_cert.pdf' },
          { field: 'step6.uploadedImmun' as const, state: uploadedImmun, label: "Child's Immunisation Card", file: 'immun_card.pdf' },
          { field: 'step6.uploadedIds' as const, state: uploadedIds, label: "Certified Parent ID Documents", file: 'parent_ids.pdf' },
          { field: 'step6.uploadedResidence' as const, state: uploadedResidence, label: "Proof of Residential Address", file: 'proof_residence.pdf' }
        ].map((up, idx) => (
          <div
            key={idx}
            onClick={() => setValue(up.field, !up.state, { shouldValidate: true })}
            className={`p-4 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center select-none cursor-pointer transition-all ${
              up.state
                ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                : 'bg-slate-50/50 border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <UploadCloud className={`w-8 h-8 ${up.state ? 'text-emerald-600' : 'text-slate-400'}`} />
            <p className="font-bold text-[11px] mt-1.5">{up.label}</p>
            {up.state ? (
              <span className="text-[9px] font-mono mt-1 font-bold inline-flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600 stroke-[3.5]" /> File: {up.file} (Ready)
              </span>
            ) : (
              <span className="text-[9px] text-slate-400 mt-1">Click to mock upload file</span>
            )}
          </div>
        ))}
      </div>

      {/* Final Review table info summary specs */}
      <div className="bg-slate-50 border p-4 rounded-xl mt-6">
        <h4 className="font-extrabold text-xs text-indigo-950 mb-2 border-b border-slate-200 pb-1 flex items-center gap-1">
          <span>📌</span> Final Registration Review
        </h4>
        <div className="grid grid-cols-2 gap-y-1.5 text-[11px] font-medium text-slate-600">
          <p>Learner Name: <span className="text-slate-900 font-black">{firstNames || 'N/A'} {surname}</span></p>
          <p>Class Allocation: <span className="text-indigo-700 font-bold">{systemClass || 'N/A'} Room</span></p>
          <p>Family ID / Passport: <span className="font-mono text-slate-800">{idNumber || 'Awaiting'}</span></p>
          <p>Parent Signer Ref: <span className="text-slate-900 font-bold">{signerName || 'N/A'}</span></p>
        </div>
      </div>
    </div>
  );
}
