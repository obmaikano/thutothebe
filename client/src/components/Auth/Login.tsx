import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../Input/Button';
import InputText from '../Input/InputText';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login: React.FC = () => {
    const { login, error: authError, clearError, user } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role) {
            switch (user.role) {
                case 'STUDENT':
                case 'TEACHER':
                case 'ADMIN':
                    navigate('/app/dashboard');
                    break;
                default:
                    navigate('/app/dashboard');
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        clearError();
        
        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            return;
        }
        
        try {
            await login(formData.email, formData.password);
            // Navigation is handled in useEffect
        } catch (error) {
            setError('Invalid credentials. Please try again.');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="bg-white p-10 shadow-xl rounded-2xl border border-gray-100">
                <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-8 tracking-tight">Login to Botswana LMS</h2>
                {(error || authError) && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        {error || authError?.message}
                    </div>
                )}
                <div className="mb-6">
                    <InputText
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        leftIcon={<Mail size={20} className="text-blue-400" />}
                        error={error && !formData.email ? 'Email is required' : undefined}
                        inputClassName="bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-gray-900 placeholder-gray-400 py-3 px-4 rounded-lg shadow-sm transition-all"
                        labelClassName="text-base font-semibold text-gray-700 mb-2"
                    />
                </div>
                <div className="mb-6">
                    <InputText
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        leftIcon={<Lock size={20} className="text-blue-400" />}
                        rightIcon={
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="text-gray-400 hover:text-blue-500 focus:outline-none"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        }
                        error={error && !formData.password ? 'Password is required' : undefined}
                        inputClassName="bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-gray-900 placeholder-gray-400 py-3 px-4 rounded-lg shadow-sm transition-all"
                        labelClassName="text-base font-semibold text-gray-700 mb-2"
                    />
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
                    isLoading={false}
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