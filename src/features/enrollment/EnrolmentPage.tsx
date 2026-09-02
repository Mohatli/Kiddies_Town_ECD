import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import EnrolmentWizard from '../../components/EnrolmentWizard';
import { api } from '../../lib/apiClient';
import type { EnrolmentApplication } from '../../types';

export default function EnrolmentPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleComplete = async (application: EnrolmentApplication) => {
    setSubmitError(null);
    try {
      await api.post('/enrolments', application);
    } catch {
      // Local completion already happened in the wizard; surface the sync failure
      setSubmitError(
        'Your application was recorded locally, but we could not reach the school server. Please contact the office so your registration is not lost.'
      );
    }
  };

  return (
    <div className="space-y-4">
      {submitError && (
        <div role="alert" className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-[11px] font-bold leading-relaxed">{submitError}</p>
        </div>
      )}
      <EnrolmentWizard onComplete={handleComplete} />
    </div>
  );
}
