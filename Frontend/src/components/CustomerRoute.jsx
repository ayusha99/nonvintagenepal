import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CustomerRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-black" />
      </div>
    );
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default CustomerRoute;
