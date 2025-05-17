import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import ForgotPassword from '../features/auth/pages/ForgotPassword';
import ResetPassword from '../features/auth/pages/ResetPassword';
import Dashboard from '../features/dashboard/pages/Dashboard';
import ProfilePage from '../features/profile/pages/ProfilePage';
import NotFound from '../features/common/pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
// Course routes
import CourseListPage from '../features/courses/pages/CourseListPage';
import CourseDetailPage from '../features/courses/pages/CourseDetailPage';
import NewCoursePage from '../features/courses/pages/NewCoursePage';
import EditCoursePage from '../features/courses/pages/EditCoursePage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Course Routes */}
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/courses/new" element={<NewCoursePage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/courses/:id/edit" element={<EditCoursePage />} />
      </Route>

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 