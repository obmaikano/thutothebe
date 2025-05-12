import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { School } from 'lucide-react';
import InputText from '../components/Input/InputText';
import Button from '../components/Input/Button';
import Alert from '../components/Alert/Alert';
import { useAuth } from '../contexts/AuthContext';

interface FormValue {
    value: string;
}

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string>('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        }
    };

    const updateFormValue = ({ updateType, value }: { updateType: string; value: string }) => {
        setFormData(prev => ({ ...prev, [updateType]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-xl overflow-hidden shadow-2xl bg-white">
                {/* Left side with image */}
                <div className="lg:w-1/2 relative bg-blue-800 flex flex-col justify-center items-center p-8 text-white">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <img
                            src="https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            alt="Botswana school"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="z-10 text-center">
                        <div className="inline-flex items-center justify-center p-4 bg-white bg-opacity-10 rounded-full mb-6">
                            <School size={48} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Join Thuto Thebe</h1>
                        <p className="text-white text-opacity-80 mb-6">
                            Create your account to access the learning management system
                        </p>
                    </div>
                </div>

                {/* Right side with registration form */}
                <div className="lg:w-1/2 flex items-center justify-center p-4 md:p-8">
                    <div className="w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
                        {error && (
                            <Alert
                                type="error"
                                message={error}
                                showClose
                                onClose={() => setError('')}
                            />
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <InputText
                                    labelTitle="First Name"
                                    type="text"
                                    defaultValue={formData.firstName}
                                    updateFormValue={updateFormValue}
                                    updateType="firstName"
                                />
                                <InputText
                                    labelTitle="Last Name"
                                    type="text"
                                    defaultValue={formData.lastName}
                                    updateFormValue={updateFormValue}
                                    updateType="lastName"
                                />
                            </div>
                            <InputText
                                labelTitle="Email"
                                type="email"
                                defaultValue={formData.email}
                                updateFormValue={updateFormValue}
                                updateType="email"
                            />
                            <InputText
                                labelTitle="Password"
                                type="password"
                                defaultValue={formData.password}
                                updateFormValue={updateFormValue}
                                updateType="password"
                            />
                            <InputText
                                labelTitle="Confirm Password"
                                type="password"
                                defaultValue={formData.confirmPassword}
                                updateFormValue={updateFormValue}
                                updateType="confirmPassword"
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                label="Register"
                                containerStyle="w-full"
                            />
                            <div className="text-center mt-4">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-blue-600 hover:text-blue-800">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register; 