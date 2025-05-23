import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface SchoolRegistrationProps {
  onSuccess: () => void;
}

export const SchoolRegistration: React.FC<SchoolRegistrationProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    emisCode: '',
    region: '',
    district: '',
    level: 'Primary',
    status: 'active',
    address: '',
    contactNumber: '',
    email: '',
  });

  const regions = [
    'Gaborone',
    'Francistown',
    'Molepolole',
    'Maun',
  ];

  const districts = {
    'Gaborone': ['Gaborone Central', 'Gaborone North', 'Gaborone South'],
    'Francistown': ['Francistown Central', 'Francistown North', 'Francistown South'],
    'Molepolole': ['Molepolole Central', 'Molepolole North', 'Molepolole South'],
    'Maun': ['Maun Central', 'Maun North', 'Maun South'],
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to register school
    console.log('Form submitted:', formData);
    onSuccess();
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          leftIcon={ArrowLeft}
          onClick={() => navigate('/app/schools')}
        >
          Back to Schools
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Register New School</h1>
          <p className="text-gray-600 mt-1">Add a new school to the system</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* School Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                School Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* EMIS Code */}
            <div>
              <label htmlFor="emisCode" className="block text-sm font-medium text-gray-700">
                EMIS Code
              </label>
              <input
                type="text"
                id="emisCode"
                name="emisCode"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.emisCode}
                onChange={handleInputChange}
              />
            </div>

            {/* Region */}
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Region
              </label>
              <select
                id="region"
                name="region"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.region}
                onChange={handleInputChange}
              >
                <option value="">Select Region</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                District
              </label>
              <select
                id="district"
                name="district"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.district}
                onChange={handleInputChange}
                disabled={!formData.region}
              >
                <option value="">Select District</option>
                {formData.region && districts[formData.region as keyof typeof districts]?.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            {/* School Level */}
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                School Level
              </label>
              <select
                id="level"
                name="level"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.level}
                onChange={handleInputChange}
              >
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="Combined">Combined</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Contact Number */}
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.contactNumber}
                onChange={handleInputChange}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Physical Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/app/schools')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
            >
              Register School
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}; 