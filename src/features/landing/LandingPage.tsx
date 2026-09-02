import { useNavigate } from 'react-router-dom';
import LandingPageComponent from '../../components/LandingPage';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleSelectRole = (role: 'parent' | 'admin' | 'teacher' | 'enrolment') => {
    if (role === 'enrolment') {
      navigate('/enrol');
    } else {
      navigate('/login', { state: { initialRole: role } });
    }
  };

  return <LandingPageComponent onSelectRole={handleSelectRole} />;
}
