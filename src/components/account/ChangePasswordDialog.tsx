import { FormEvent, useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { api, ApiError } from '../../lib/apiClient';

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Self-service password change dialog.
 * Talks to POST /auth/change-password (requires an authenticated session).
 */
export default function ChangePasswordDialog({ isOpen, onClose }: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = (): string | null => {
    if (!currentPassword) return 'Please enter your current password.';
    if (newPassword.length < 8) return 'New password must be at least 8 characters.';
    if (!/[A-Z]/.test(newPassword)) return 'New password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(newPassword)) return 'New password must contain at least one lowercase letter.';
    if (!/[0-9]/.test(newPassword)) return 'New password must contain at least one number.';
    if (newPassword === currentPassword) return 'The new password must be different from the current password.';
    if (newPassword !== confirmPassword) return 'The new passwords do not match.';
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update your password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-sm focus:outline-hidden focus:border-indigo-400';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Password" size="sm">
      {success ? (
        <div className="text-center py-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" aria-hidden="true" />
          <p className="font-bold text-slate-800 text-sm">Password updated successfully.</p>
          <p className="text-xs text-slate-500 mt-1">Use your new password next time you sign in.</p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold rounded-xl text-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-3">
            <div>
              <label htmlFor="cp-current" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                id="cp-current"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="cp-new" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                id="cp-new"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
              />
              <p className="mt-1 text-[10px] text-slate-400 font-medium">
                Min. 8 characters with at least one uppercase letter, one lowercase letter and one number.
              </p>
            </div>
            <div>
              <label htmlFor="cp-confirm" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                id="cp-confirm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-[11px] font-bold leading-relaxed">{error}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none transition-colors text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
              {isSubmitting ? 'Updating…' : 'Update Password'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
