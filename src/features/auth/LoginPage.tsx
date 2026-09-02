import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import LoginPageComponent from '../../components/LoginPage';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const initialRole = (location.state as { initialRole?: 'parent' | 'admin' | 'teacher' } | null)?.initialRole || 'parent';

  const handleLoginSuccess = (user: { role: 'parent' | 'admin' | 'teacher'; name: string; email: string }) => {
    // The LoginPage component stores the token in localStorage as 'kt_session_token'
    const token = localStorage.getItem('kt_session_token') || '';
    const refreshToken = localStorage.getItem('kt_refresh_token') || '';
    setAuth(user, token, refreshToken);
    navigate(`/${user.role}`, { replace: true });
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <LoginPageComponent
      initialRole={initialRole}
      onLoginSuccess={handleLoginSuccess}
      onCancel={handleCancel}
    />
  );
}
