import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchParents, 
  fetchActiveParents,
  clearParentsError,
  activateParent,
  deactivateParent,
  deleteParent
} from '../parentsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Parent } from '../../../api/services/parentApi';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Eye,
  UserPlus
} from 'lucide-react';

const ParentListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { parents, status, error } = useAppSelector(state => state.parents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchParents());
    return () => {
      dispatch(clearParentsError());
    };
  }, [dispatch]);

  const handleCreateParent = () => {
    dispatch(openModal({
      title: 'Create New Parent',
      bodyType: MODAL_BODY_TYPES.PARENT_ADD_NEW,
      size: 'md'
    }));
  };

  const handleEdit = (parent: Parent) => {
    dispatch(openModal({
      title: 'Edit Parent',
      bodyType: MODAL_BODY_TYPES.PARENT_EDIT,
      extraObject: { parent }
    }));
  };

  const handleDelete = (parent: Parent) => {
    dispatch(openModal({
      title: 'Delete Parent',
      bodyType: MODAL_BODY_TYPES.PARENT_DELETE_CONFIRMATION,
      extraObject: { parent }
    }));
  };

  const handleToggleStatus = async (parent: Parent) => {
    try {
      if (parent.active) {
        await dispatch(deactivateParent(parent.id)).unwrap();
      } else {
        await dispatch(activateParent(parent.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle parent status:', error);
    }
  };

  const handleViewDetails = (parent: Parent) => {
    window.location.href = `/app/parents/${parent.id}`;
  };

  const handleLinkChild = (parent: Parent) => {
    dispatch(openModal({
      title: 'Link Child to Parent',
      bodyType: MODAL_BODY_TYPES.PARENT_LINK_CHILD,
      extraObject: { parent }
    }));
  };

  const filteredParents = parents.filter((parent: Parent) => {
    const matchesSearch = 
      parent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (parent.identityNumber && parent.identityNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      statusFilter === '' ||
      (statusFilter === 'active' && parent.active) ||
      (statusFilter === 'inactive' && !parent.active);

    return matchesSearch && matchesStatus;
  });

  if (status === 'loading') {
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
          <h1 className="text-3xl font-bold text-gray-900">Parent Management</h1>
          <p className="text-gray-600 mt-2">Manage parent accounts and relationships</p>
        </div>
        <button 
          onClick={handleCreateParent} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add Parent
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearParentsError())}
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
              placeholder="Search parents by name, email, or ID number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {parents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{parents.length}</div>
                <div className="text-sm text-gray-500">Total Parents</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <UserCheck size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {parents.filter(p => p.active).length}
                </div>
                <div className="text-sm text-gray-500">Active Parents</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <UserX size={20} className="text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {parents.filter(p => !p.active).length}
                </div>
                <div className="text-sm text-gray-500">Inactive Parents</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Parents Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filteredParents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredParents.map((parent: Parent) => (
                  <tr key={parent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {parent.firstName} {parent.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {parent.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{parent.email}</div>
                      <div className="text-sm text-gray-500">
                        {parent.identityNumber || 'No ID Number'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {parent.schoolId ? `School ID: ${parent.schoolId}` : 'No School'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        parent.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {parent.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(parent)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(parent)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                          title="Edit Parent"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleLinkChild(parent)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Link Child"
                        >
                          <UserPlus size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(parent)}
                          className={`p-1 rounded ${
                            parent.active 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                          title={parent.active ? 'Deactivate' : 'Activate'}
                        >
                          {parent.active ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button
                          onClick={() => handleDelete(parent)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete Parent"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">
              {searchTerm || statusFilter ? 'No parents found matching your criteria' : 'No parents found'}
            </div>
            {!searchTerm && !statusFilter && (
              <button
                onClick={handleCreateParent}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <Plus size={16} />
                Add First Parent
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentListPage; 