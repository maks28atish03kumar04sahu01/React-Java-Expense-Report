import { Navigate } from 'react-router-dom';
import useStore from './store/useStore';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/expense/frontend/api/v1/signin" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    const user = useStore.getState().user;
    return (
      <Navigate
        to={`/expense/frontend/api/v1/${user.id}/${user.username}/expense`}
        replace
      />
    );
  }

  return children;
};

export { ProtectedRoute, PublicRoute };
