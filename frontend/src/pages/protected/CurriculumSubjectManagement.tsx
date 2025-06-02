import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { setPageTitle } from '../../features/common/headerSlice';
import CurriculumSubjectManagement from '../../features/curriculum/components/CurriculumSubjectManagement';
import { ArrowLeft } from 'lucide-react';

const CurriculumSubjectManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { curriculumId } = useParams<{ curriculumId: string }>();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Curriculum Subject Management' }));
  }, [dispatch]);

  if (!curriculumId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Curriculum</h2>
            <p className="text-gray-600 mb-6">No curriculum ID provided.</p>
            <button
              onClick={() => navigate('/app/curriculum')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Curriculum List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/app/curriculum/${curriculumId}`)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Curriculum Details"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Subject Management</h1>
                <p className="text-gray-600">Manage subjects for this curriculum</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-full">
          <CurriculumSubjectManagement curriculumId={parseInt(curriculumId)} />
        </div>
      </div>
    </div>
  );
};

export default CurriculumSubjectManagementPage; 