import React from 'react';
import { Link } from 'react-router-dom';
import { Frown } from 'lucide-react';

const NotFound: React.FC = () => {
    return (
        <div className="hero h-4/5 bg-base-200">
            <div className="hero-content text-accent text-center">
                <div className="max-w-md">
                    <Frown className="h-48 w-48 inline-block" />
                    <h1 className="text-5xl font-bold">404 - Not Found</h1>
                    <p className="py-6">The page you are looking for doesn't exist.</p>
                    <Link to="/app/dashboard">
                        <button className="btn bg-base-100 btn-outline">Go to Dashboard</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound; 