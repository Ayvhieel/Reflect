import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from './Dashboard';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-journal-secondary/5 to-journal-primary/5">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-journal-primary to-journal-secondary rounded-2xl flex items-center justify-center animate-pulse mb-4 mx-auto">
            <span className="text-white">❤️</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : null;
};

export default Index;
