import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  // Temporarily bypass authentication for development testing
  // TODO: Remove this bypass when authentication is properly set up
  return <>{children}</>;
  
  // Original authentication logic (commented out for development)
  /*
  const { user, isAuthenticated } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If there are required roles, check if the user has any of them
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = user && user.role && requiredRoles.includes(user.role);
    
    if (!hasRequiredRole) {
      // User doesn't have required role, redirect to dashboard or unauthorized page
      return <Navigate to="/app/dashboard" replace />;
    }
  }

  return <>{children}</>;
  */
} 