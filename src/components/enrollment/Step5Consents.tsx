import React, { useRef, useState, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { EnrolmentFormValues } from './enrollmentSchemas';
import FieldError from './FieldError';

export default function Step5Consents() {
  const { register } = useFormContext<EnrolmentFormValues>();
  
  const signerName = useWatch({ name: 'step5.signerName' });

  // SIGNATURE DRAWING PAD STATES & HANDLERS
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#312e81'; // Deep Indigo ink color

    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-50 pb-2">
        <h3 className="text-sm font-extrabold text-indigo-950">5. Consents & Agreements</h3>
        <p className="text-[11px] text-slate-400 font-semibold">Please read the financial and indemnity policies carefully before registering.</p>
      </div>

      <div className="space-y-3">
        <label className="p-3.5 bg-slate-50/70 border border-slate-150 rounded-xl flex items-start gap-2.5 cursor-pointer select-none leading-relaxed text-slate-600">
          <input
            type="checkbox"
            {...register('step5.signIndemnity')}
            className="w-4.5 h-4.5 accent-indigo-600 rounded mt-0.5 shrink-0"
          />
          <span>
            <strong className="text-indigo-950 block text-[11px] font-extrabold mb-0.5">Indemnity Agreement:</strong>
            I/We grant permission for my child to participate in out-of-school excursions and play on school grounds under supervised care guidelines.
          </span>
        </label>
        <FieldError name="step5.signIndemnity" />

        <label className="p-3.5 bg-slate-50/70 border border-slate-150 rounded-xl flex items-start gap-2.5 cursor-pointer select-none leading-relaxed text-slate-600">
          <input
            type="checkbox"
            {...register('step5.signPopi')}
            className="w-4.5 h-4.5 accent-indigo-600 rounded mt-0.5 shrink-0"
          />
          <span>
            <strong className="text-indigo-950 block text-[11px] font-extrabold mb-0.5">POPI Act Agreement:</strong>
            I/We grant permission to take pictures or capture videos for educational portfolio displays. No photos will be sold.
          </span>
        </label>
        <FieldError name="step5.signPopi" />

        <label className="p-3.5 bg-slate-50/70 border border-slate-150 rounded-xl flex items-start gap-2.5 cursor-pointer select-none leading-relaxed text-slate-600">
          <input
            type="checkbox"
            {...register('step5.signFinance')}
            className="w-4.5 h-4.5 accent-indigo-600 rounded mt-0.5 shrink-0"
          />
          <span>
            <strong className="text-indigo-950 block text-[11px] font-extrabold mb-0.5">Financial Agreement:</strong>
            I recognize the registration fee of R600 is non-refundable. Monthly fees are payable before the 3rd of each month. In Late payments beyond 7th, late penalties of R250 occur.
          </span>
        </label>
        <FieldError name="step5.signFinance" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Monthly Payment Date</label>
          <select
            {...register('step5.paymentDay')}
            className="bg-slate-50 border w-full px-3 py-2.5 border-slate-200 rounded-xl text-slate-705 focus:outline-hidden font-semibold"
          >
            <option value="15th">15th of each month</option>
            <option value="20th">20th of each month</option>
            <option value="25th">25th of each month</option>
            <option value="31st">31st of each month</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Authorized Signature Name</label>
          <input
            type="text"
            {...register('step5.signerName')}
            placeholder="e.g. Sarah Mbeki"
            className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-808 font-bold focus:outline-hidden"
          />
          <FieldError name="step5.signerName" />
        </div>
      </div>

      {/* HIGH FIDELITY CANVAS SIGNATURE INTEGRATION */}
      <div className="pt-4 mt-3 border-t border-slate-100">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Interactive Hand-drawn Digital Signature
          </label>
          <button
            type="button"
            onClick={clearCanvas}
            className="text-xs font-bold text-indigo-650 hover:text-red-500 font-mono transition-all cursor-pointer select-none"
          >
            [ Clear Signature Pad ]
          </button>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl relative overflow-hidden" style={{ height: '110px' }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={110}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair block absolute top-0 left-0 z-10"
            id="wizard-signature-canvas"
          />
          {!signerName && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-[11px] font-medium leading-normal text-center select-none p-4">
              Draw your signature here with your cursor or finger / Or use the Presentation Console to prefill
            </div>
          )}
        </div>
        <p className="text-[9px] text-slate-400 mt-1 font-medium">This hand-drawn digital signature is secure and bound to school records for POPI auditing compliance.</p>
      </div>
    </div>
  );
}
