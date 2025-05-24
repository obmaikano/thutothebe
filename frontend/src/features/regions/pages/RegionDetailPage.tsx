import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchRegionById, clearCurrentRegion } from '../regionsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { StatCard } from '../../../components/ui/stat-card';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import {
  MapPin,
  ArrowLeft,
  Download,
  Building,
  Users,
  BarChart3,
  Activity,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

const RegionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentRegion: region, status, error } = useAppSelector(state => state.regions);

  useEffect(() => {
    if (id) {
      dispatch(fetchRegionById(parseInt(id, 10)));
    }
    return () => {
      dispatch(clearCurrentRegion());
    };
  }, [dispatch, id]);

  const handleEdit = () => {
    if (region) {
      dispatch(openModal({
        title: 'Edit Region',
        bodyType: MODAL_BODY_TYPES.REGION_EDIT,
        extraObject: region
      }));
    }
  };

  const handleDelete = () => {
    if (region) {
      dispatch(openModal({
        title: 'Delete Region',
        bodyType: MODAL_BODY_TYPES.REGION_DELETE_CONFIRMATION,
        extraObject: region
      }));
    }
  };

  const handleCreateSchool = () => {
    if (region) {
      // Navigate to schools page with region filter or open create school modal
      navigate(`/app/schools?region=${region.id}`);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Region</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            to="/app/regions" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Regions
          </Link>
        </div>
      </div>
    );
  }

  if (!region) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Region Not Found</h1>
          <p className="text-gray-600 mb-6">The requested region could not be found.</p>
          <Link 
            to="/app/regions" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Regions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <Link 
            to="/app/regions" 
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{region.name}</h1>
              <p className="text-gray-600 mt-2">Regional code: {region.code}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  region.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {region.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit size={16} className="mr-2" />
            Edit Region
          </Button>
          <Button>
            <Download size={16} className="mr-2" />
            Export Region Data
          </Button>
        </div>
      </div>

      {/* Region Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Schools"
          value={(region.schoolCount || 0).toString()}
          icon={Building}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Students"
          value={(region.studentCount || 0).toLocaleString()}
          icon={Users}
          iconColor="bg-green-100 text-green-600"
        />
        <StatCard
          title="Teachers"
          value={(region.teacherCount || 0).toLocaleString()}
          icon={Users}
          iconColor="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="Performance"
          value={`${region.performance || 0}%`}
          icon={BarChart3}
          iconColor="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="System Adoption"
          value={`${region.systemAdoption || 0}%`}
          icon={Activity}
          iconColor="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title="Status"
          value={region.active ? 'Active' : 'Inactive'}
          icon={region.active ? CheckCircle : AlertTriangle}
          iconColor={region.active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Information */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Regional Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Region Code:</span>
              <span className="font-medium">{region.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${region.active ? 'text-green-600' : 'text-red-600'}`}>
                {region.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            {region.description && (
              <div>
                <span className="text-gray-600">Description:</span>
                <p className="font-medium mt-1">{region.description}</p>
              </div>
            )}
            {region.teacherCount && region.studentCount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Student-Teacher Ratio:</span>
                <span className="font-medium">{Math.round(region.studentCount / region.teacherCount)}:1</span>
              </div>
            )}
            {region.schoolCount && region.studentCount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Schools per 1000 Students:</span>
                <span className="font-medium">{((region.schoolCount / region.studentCount) * 1000).toFixed(1)}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Academic Performance</span>
                <span className="font-medium">{region.performance || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${region.performance || 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">System Adoption</span>
                <span className="font-medium">{region.systemAdoption || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${region.systemAdoption || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Regional Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to={`/app/schools?region=${region.id}`}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Building size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">View Schools</p>
                <p className="text-sm text-gray-500">{region.schoolCount || 0} schools</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to={`/app/reports/school-performance?region=${region.name}`}
            className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <BarChart3 size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Performance Report</p>
                <p className="text-sm text-gray-500">Detailed analytics</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to={`/app/monitoring/regional?region=${region.name}`}
            className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Activity size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Usage Monitoring</p>
                <p className="text-sm text-gray-500">Real-time data</p>
              </div>
            </div>
          </Link>
          
          <button 
            onClick={handleCreateSchool}
            className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <Plus size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add School</p>
                <p className="text-sm text-gray-500">Create new school</p>
              </div>
            </div>
          </button>
        </div>
      </Card>

      {/* Management Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Management</h2>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleEdit}>
            <Edit size={16} className="mr-2" />
            Edit Region
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 size={16} className="mr-2" />
            Delete Region
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default RegionDetailPage; 