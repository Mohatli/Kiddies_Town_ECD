import { useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface DashboardHeaderProps {
  portalLabel: string;
  onOpenPasswordDialog: () => void;
}

export default function DashboardHeader({ portalLabel, onOpenPasswordDialog }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (!user) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/')} className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
          ← Home
        </button>
        <span className="text-sm text-slate-400">|</span>
        <span className="text-sm font-medium text-slate-700">{portalLabel}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">Welcome, {user.name}</span>
        <button
          onClick={onOpenPasswordDialog}
          className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
          Change Password
        </button>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
