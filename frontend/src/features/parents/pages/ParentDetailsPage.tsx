import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchParentById, 
  fetchChildrenByParentId,
  activateParent,
  deactivateParent,
  deleteParent
} from '../parentsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { extractErrorMessage } from '../../../utils/errorUtils';
import { Parent } from '../../../api/services/parentApi';
import { User } from '../../../api/services/userApi';
import { 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  UserPlus,
  ArrowLeft
} from 'lucide-react';

const ParentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const { currentParent, children, status } = useAppSelector(state => state.parents);

  useEffect(() => {
    if (id) {
      dispatch(fetchParentById(parseInt(id)))
        .unwrap()
        .catch((err: any) => setError(extractErrorMessage(err)));
      dispatch(fetchChildrenByParentId(parseInt(id)))
        .unwrap()
        .catch((err: any) => setError(extractErrorMessage(err)));
    }
  }, [dispatch, id]);

  const handleEdit = () => {
    if (currentParent) {
      dispatch(openModal({
        title: 'Edit Parent',
        bodyType: MODAL_BODY_TYPES.PARENT_EDIT,
        extraObject: { parent: currentParent }
      }));
    }
  };

  const handleDelete = () => {
    if (currentParent) {
      dispatch(openModal({
        title: 'Delete Parent',
        bodyType: MODAL_BODY_TYPES.PARENT_DELETE_CONFIRMATION,
        extraObject: { parent: currentParent }
      }));
    }
  };

  const handleLinkChild = () => {
    if (currentParent) {
      dispatch(openModal({
        title: 'Link Child',
        bodyType: MODAL_BODY_TYPES.PARENT_LINK_CHILD,
        extraObject: { parent: currentParent }
      }));
    }
  };

  const handleToggleStatus = async () => {
    if (currentParent) {
      try {
        if (currentParent.active) {
          await dispatch(deactivateParent(currentParent.id)).unwrap();
        } else {
          await dispatch(activateParent(currentParent.id)).unwrap();
        }
      } catch (err: any) {
        setError(extractErrorMessage(err));
      }
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!currentParent) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          Parent not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentParent.firstName} {currentParent.lastName}
          </h1>
          <p className="text-gray-500">Parent Details</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/parents')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Back to List
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Parent Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Parent Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">First Name</p>
            <p className="text-gray-900">{currentParent.firstName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Name</p>
            <p className="text-gray-900">{currentParent.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-900">{currentParent.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Identity Number</p>
            <p className="text-gray-900">{currentParent.identityNumber || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                currentParent.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {currentParent.active ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={handleToggleStatus}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {currentParent.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Children */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Linked Children</h2>
          <button
            onClick={handleLinkChild}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Link New Child
          </button>
        </div>

        {children.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No children linked to this parent
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map((child: User) => (
              <div
                key={child.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {child.firstName[0]}{child.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {child.firstName} {child.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{child.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDetailsPage; 