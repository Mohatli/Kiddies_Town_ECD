import { useEffect } from 'react';
import { Providers } from './app/providers';
import { AppRouter } from './app/router';
import { useAuthStore } from './stores/authStore';

function AppInner() {
  const restoreSession = useAuthStore((s) => s.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    document.title = 'Kiddies Town Portal';
  }, []);

  return <AppRouter />;
}

export default function App() {
  return (
    <Providers>
      <AppInner />
    </Providers>
  );
}
