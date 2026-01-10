import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Feed from './Feed';

const Index = () => {
  // Add 'loading' here from your context
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // ONLY navigate if we are sure the loading is finished
    // and the user is still not authenticated
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, loading, navigate]);

  // Phase 1: Still checking if a cookie exists
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading your feed...</p> 
      </div>
    );
  }

  // Phase 2: Not authenticated (the useEffect above will handle redirection)
  if (!isAuthenticated) {
    return null;
  }

  // Phase 3: Authenticated successfully [web:2]
  return <Feed />;
};

export default Index;
