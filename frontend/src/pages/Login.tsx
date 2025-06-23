import React from 'react';
import Login from '../features/auth/pages';
import Footer from '../components/common/Footer';
import { School } from 'lucide-react';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-4">
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
              <h1 className="text-3xl font-bold mb-4">Thuto Thebe Learning Management System</h1>
              <p className="text-white text-opacity-80 mb-6">
                Transforming education through accessible digital learning
              </p>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-1">For Educators</h3>
                  <p className="text-sm text-white text-opacity-80">Create engaging lessons and track student progress</p>
                </div>
                <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-1">For Students</h3>
                  <p className="text-sm text-white text-opacity-80">Access learning materials anytime, anywhere</p>
                </div>
                <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-1">For Parents</h3>
                  <p className="text-sm text-white text-opacity-80">Monitor your child's education journey</p>
                </div>
                <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-1">For Administrators</h3>
                  <p className="text-sm text-white text-opacity-80">Oversee educational resources across regions</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side with login form */}
          <div className="lg:w-1/2 flex items-center justify-center p-4 md:p-8">
            <Login />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;