import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import teacherApi from '../../../api/services/teacherApi';
import contentApi, { Content } from '../../../api/services/contentApi';
import { Teacher } from '../../../api/services/teacherApi';
import UploadResourceModal from '../components/UploadResourceModal';
import { 
  FileText, 
  Video, 
  Link, 
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  AlertTriangle,
  FolderOpen,
  Search,
  Globe
} from 'lucide-react';

const TeacherResourcesPage: React.FC = () => {
  const { user } = useAuth();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [resources, setResources] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'DOCUMENT' | 'VIDEO' | 'LINK' | 'ANNOUNCEMENT' | 'SCHEDULE'>('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchTeacherResources();
  }, [user?.id]);

  const fetchTeacherResources = async () => {
    if (!user?.id) {
      setError('User information not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // First, fetch the teacher record using the user ID
      const teacherResponse = await teacherApi.getByUserId(user.id);
      const teacherData = Array.isArray(teacherResponse.data.data) 
        ? teacherResponse.data.data[0] 
        : teacherResponse.data.data;
      
      if (!teacherData) {
        setError('Teacher profile not found. Please contact your administrator to set up your teacher profile.');
        setLoading(false);
        return;
      }
      
      setTeacher(teacherData);
      
      // Fetch teacher's resources
      const resourcesResponse = await contentApi.getByTeacher(teacherData.id);
      const teacherResources = Array.isArray(resourcesResponse.data.data) 
        ? resourcesResponse.data.data 
        : [];
      setResources(teacherResources);

    } catch (err: any) {
      console.error('Error fetching teacher resources:', err);
      if (err.response?.status === 404) {
        setError('Teacher profile not found. Please contact your administrator to set up your teacher profile.');
      } else {
        setError(err.response?.data?.message || 'Failed to load resources');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    fetchTeacherResources();
  };

  const handleViewDetails = (resource: Content) => {
    window.open(resource.url, '_blank');
  };

  const handleEdit = (resource: Content) => {
    // TODO: Implement edit functionality
    console.log('Edit resource:', resource);
  };

  const handleDelete = async (resource: Content) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await contentApi.delete(resource.id);
        fetchTeacherResources();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete resource');
      }
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || resource.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT': return FileText;
      case 'VIDEO': return Video;
      case 'LINK': return Link;
      case 'ANNOUNCEMENT': return FileText;
      case 'SCHEDULE': return FileText;
      default: return FileText;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'DOCUMENT': return 'bg-blue-100 text-blue-800';
      case 'VIDEO': return 'bg-purple-100 text-purple-800';
      case 'LINK': return 'bg-green-100 text-green-800';
      case 'ANNOUNCEMENT': return 'bg-yellow-100 text-yellow-800';
      case 'SCHEDULE': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceStats = () => {
    const total = resources.length;
    const documents = resources.filter(r => r.type === 'DOCUMENT').length;
    const videos = resources.filter(r => r.type === 'VIDEO').length;
    const links = resources.filter(r => r.type === 'LINK').length;
    const active = resources.filter(r => r.active).length;
    
    return { total, documents, videos, links, active };
  };

  const stats = getResourceStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teaching Resources</h1>
          <p className="text-gray-600 mt-2">Manage your course materials and resources</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Upload Resource
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search resources by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Types</option>
            <option value="DOCUMENT">Documents</option>
            <option value="VIDEO">Videos</option>
            <option value="LINK">Links</option>
            <option value="ANNOUNCEMENT">Announcements</option>
            <option value="SCHEDULE">Schedules</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {resources.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FolderOpen size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-500">Total Resources</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <FileText size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.documents}</div>
                <div className="text-sm text-gray-500">Documents</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Video size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.videos}</div>
                <div className="text-sm text-gray-500">Videos</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <Link size={20} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.links}</div>
                <div className="text-sm text-gray-500">Links</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resources Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResources.length > 0 ? (
                filteredResources.map((resource) => {
                  const TypeIcon = getTypeIcon(resource.type);
                  return (
                    <tr key={resource.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <TypeIcon size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {resource.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadgeColor(resource.type)}`}>
                          {resource.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          resource.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {resource.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Globe size={16} className="mr-2 text-gray-400" />
                          <span className="truncate max-w-xs">{resource.url}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(resource)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View/Open Resource"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(resource)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(resource)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-sm font-medium text-gray-900 mb-2">No resources found</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {searchTerm || typeFilter !== 'ALL' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Get started by uploading your first resource.'
                      }
                    </p>
                    {!searchTerm && typeFilter === 'ALL' && (
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
                      >
                        <Plus size={20} className="mr-2" />
                        Upload Resource
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Resource Modal */}
      <UploadResourceModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default TeacherResourcesPage; 