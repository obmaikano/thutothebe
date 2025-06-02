import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCurriculumRecommendations, validateCurriculumAlignment } from '../curriculumSlice';
import { Curriculum } from '../../../api/services/curriculumApi';
import {
  Star,
  BookOpen,
  Calendar,
  MapPin,
  School,
  CheckCircle,
  AlertTriangle,
  Filter,
  RefreshCw,
  Eye,
  Download,
  Shield,
  Target,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';

interface CurriculumRecommendationsTabProps {
  curriculumId?: number;
}

const CurriculumRecommendationsTab: React.FC<CurriculumRecommendationsTabProps> = ({ curriculumId }) => {
  const dispatch = useAppDispatch();
  const { curricula, status } = useAppSelector(state => state.curriculum);
  const { user } = useAppSelector(state => state.auth);
  
  const [filters, setFilters] = useState({
    gradeLevel: 'STANDARD_1',
    type: 'NATIONAL',
    regionId: user?.regionId || undefined
  });
  
  const [validationResults, setValidationResults] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFetchRecommendations = async () => {
    setLoading(true);
    try {
      await dispatch(fetchCurriculumRecommendations(filters)).unwrap();
      showNotification('success', 'Recommendations loaded successfully');
    } catch (error: any) {
      showNotification('error', error || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateAlignment = async (recommendationId: number) => {
    if (!filters.regionId) {
      showNotification('error', 'Region is required for validation');
      return;
    }

    try {
      const result = await dispatch(validateCurriculumAlignment({
        curriculumId: recommendationId,
        regionId: filters.regionId
      })).unwrap();
      
      setValidationResults(prev => ({
        ...prev,
        [recommendationId]: result
      }));
      
      showNotification('success', 'Curriculum alignment validated successfully');
    } catch (error: any) {
      showNotification('error', error || 'Failed to validate curriculum alignment');
    }
  };

  // Filter curricula based on current filters and exclude current curriculum
  const getFilteredRecommendations = () => {
    return curricula.filter(curriculum => {
      // Exclude current curriculum if provided
      if (curriculumId && curriculum.id === curriculumId) {
        return false;
      }
      
      // Apply filters
      if (filters.gradeLevel && curriculum.gradeLevel !== filters.gradeLevel) {
        return false;
      }
      
      if (filters.type && curriculum.curriculumType !== filters.type) {
        return false;
      }
      
      // Only show approved or active curricula as recommendations
      if (!['APPROVED', 'ACTIVE'].includes(curriculum.status)) {
        return false;
      }
      
      return true;
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'APPROVED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'ACTIVE': { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      'DRAFT': { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle },
      'UNDER_REVIEW': { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['DRAFT'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'NATIONAL': { color: 'bg-purple-100 text-purple-800', icon: Star },
      'REGIONAL': { color: 'bg-blue-100 text-blue-800', icon: MapPin },
      'SCHOOL_SPECIFIC': { color: 'bg-orange-100 text-orange-800', icon: School }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig['NATIONAL'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {type.replace('_', ' ')}
      </span>
    );
  };

  useEffect(() => {
    handleFetchRecommendations();
  }, [filters]);

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`alert ${
          notification.type === 'success' ? 'alert-success' : 
          notification.type === 'error' ? 'alert-error' : 'alert-info'
        } mb-4`}>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Curriculum Recommendations</h3>
            <p className="text-gray-600">Discover curricula that match your requirements and standards</p>
          </div>
          <button
            onClick={handleFetchRecommendations}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
            <select
              value={filters.gradeLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, gradeLevel: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="STANDARD_1">Standard 1</option>
              <option value="STANDARD_2">Standard 2</option>
              <option value="STANDARD_3">Standard 3</option>
              <option value="STANDARD_4">Standard 4</option>
              <option value="STANDARD_5">Standard 5</option>
              <option value="STANDARD_6">Standard 6</option>
              <option value="STANDARD_7">Standard 7</option>
              <option value="FORM_1">Form 1</option>
              <option value="FORM_2">Form 2</option>
              <option value="FORM_3">Form 3</option>
              <option value="FORM_4">Form 4</option>
              <option value="FORM_5">Form 5</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Curriculum Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="NATIONAL">National</option>
              <option value="REGIONAL">Regional</option>
              <option value="SCHOOL_SPECIFIC">School Specific</option>
              <option value="INTERNATIONAL">International</option>
              <option value="VOCATIONAL">Vocational</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region (Optional)</label>
            <select
              value={filters.regionId || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, regionId: e.target.value ? parseInt(e.target.value) : undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Regions</option>
              <option value="1">Central Region</option>
              <option value="2">Northern Region</option>
              <option value="3">Southern Region</option>
              <option value="4">Eastern Region</option>
              <option value="5">Western Region</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center min-h-64">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        ) : getFilteredRecommendations().length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters to find relevant curricula.</p>
            <button
              onClick={handleFetchRecommendations}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Recommendations
            </button>
          </div>
        ) : (
          getFilteredRecommendations().map((curriculum) => (
            <div key={curriculum.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{curriculum.title}</h4>
                    {getStatusBadge(curriculum.status)}
                    {getTypeBadge(curriculum.curriculumType)}
                  </div>
                  <p className="text-gray-600 mb-3">{curriculum.description}</p>
                  
                  {/* Curriculum Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Academic Year: {curriculum.academicYear}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Duration: {curriculum.durationWeeks} weeks
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Total Hours: {curriculum.totalHours}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Created by: {curriculum.createdByName}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleValidateAlignment(curriculum.id)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Validate
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <Download className="h-4 w-4 mr-1" />
                    Adopt
                  </button>
                </div>
              </div>
              
              {/* Validation Results */}
              {validationResults[curriculum.id] && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Validation Result</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">{validationResults[curriculum.id]}</p>
                </div>
              )}
              
              {/* Recommendation Score */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Recommendation Score:</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">(4.0/5.0)</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  95% compatibility
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CurriculumRecommendationsTab; 