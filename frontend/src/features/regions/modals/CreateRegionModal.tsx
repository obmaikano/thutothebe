import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { fetchRegions } from '../regionsSlice';
import { fetchLatestRegionMonitoringForAllRegions } from '../regionMonitoringSlice';
import { Region } from '../../../api/services/regionApi';
import RegionForm from '../components/RegionForm';
import { MapPin, Plus } from 'lucide-react';

interface CreateRegionModalProps {
  extraObject?: any;
}

export const CreateRegionModal: React.FC<CreateRegionModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleSubmit = async (region: Region) => {
    try {
      setIsSuccess(true);
      
      // First refresh both regions list and monitoring data
      await Promise.all([
        dispatch(fetchRegions()),
        dispatch(fetchLatestRegionMonitoringForAllRegions())
      ]);
      
      // Only close the modal after data is refreshed
      handleClose();
      
    } catch (error) {
      console.error('Failed to create region:', error);
      setIsSuccess(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <MapPin className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Region Created Successfully!</h3>
        <p className="text-gray-600">The new region has been added to your system.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Plus className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Create New Region</h3>
          <p className="text-sm text-gray-600">Add a new administrative region to your system</p>
        </div>
      </div>

      {/* Form */}
      <div>
        <RegionForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </div>
    </div>
  );
};

export default CreateRegionModal; 