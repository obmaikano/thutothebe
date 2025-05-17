import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Eye, EyeOff, Mail, Lock, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

const Login: React.FC = () => {
    const { login, error: authError, clearError, setAuthError, user } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role) {
            switch (user.role) {
                case 'STUDENT':
                case 'TEACHER':
                case 'ADMIN':
                case 'SUPER_ADMIN':
                case 'MINISTRY_ADMIN':
                case 'SCHOOL_ADMIN':
                case 'PARENT':
                    navigate('/app/dashboard');
                    break;
                default:
                    navigate('/app/dashboard');
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        
        if (!formData.email || !formData.password) {
            setAuthError('Please enter both email and password', 'warning');
            return;
        }
        
        try {
            await login(formData.email, formData.password);
            // Navigation is handled in useEffect
        } catch (error) {
            // Error is already handled in the AuthContext
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Get the appropriate icon based on error type
    const getErrorIcon = () => {
        if (!authError) return null;
        
        switch (authError.type) {
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-500 mr-2" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />;
            case 'info':
                return <Info className="h-5 w-5 text-blue-500 mr-2" />;
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500 mr-2" />;
            default:
                return null;
        }
    };

    // Get the background color based on error type
    const getErrorStyles = () => {
        if (!authError) return '';
        
        switch (authError.type) {
            case 'error':
                return 'bg-red-100 text-red-700';
            case 'warning':
                return 'bg-yellow-100 text-yellow-700';
            case 'info':
                return 'bg-blue-100 text-blue-700';
            case 'success':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="bg-white p-10 shadow-xl rounded-2xl border border-gray-100">
                <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-8 tracking-tight">Login to Botswana LMS</h2>
                {authError && (
                    <div className={`mb-4 p-3 rounded-md text-sm flex items-center ${getErrorStyles()}`}>
                        {getErrorIcon()}
                        <span>{authError.message}</span>
                    </div>
                )}
                <div className="mb-6">
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        error={authError && !formData.email ? 'Email is required' : undefined}
                        icon={Mail}
                        className="bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-gray-900 placeholder-gray-400 py-3 px-4 rounded-lg shadow-sm transition-all"
                    />
                </div>
                <div className="mb-6">
                    <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        error={authError && !formData.password ? 'Password is required' : undefined}
                        icon={Lock}
                        className="bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-gray-900 placeholder-gray-400 py-3 px-4 rounded-lg shadow-sm transition-all"
                    />
                </div>
                <div className="flex justify-end -mt-4 mb-4">
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="text-gray-400 hover:text-blue-500 focus:outline-none text-sm"
                    >
                        {showPassword ? (
                            <span className="flex items-center"><EyeOff size={16} className="mr-1" /> Hide password</span>
                        ) : (
                            <span className="flex items-center"><Eye size={16} className="mr-1" /> Show password</span>
                        )}
                    </button>
                </div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={false}
                >
                    Log in
                </Button>
                <p className="mt-6 text-center text-sm">
                    <Link to="/help" className="text-blue-600 hover:underline">
                        Need help logging in?
                    </Link>
                </p>
            </form>
            <div className="flex items-center justify-center mt-6">
                <button className="px-4 py-2 border rounded-l-md border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    English
                </button>
                <button className="px-4 py-2 border-t border-b border-r rounded-r-md border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Setswana
                </button>
            </div>
        </div>
    );
};

export default Login; 