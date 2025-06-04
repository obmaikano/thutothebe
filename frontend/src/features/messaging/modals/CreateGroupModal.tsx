import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { createMessageGroup } from '../messagesSlice';
import { closeModal } from '../../common/modalSlice';
import { CreateMessageGroupRequest } from '../../../api/services/messageApi';

interface CreateGroupModalProps {
  title: string;
  closeModal: () => void;
  extraObject?: Record<string, unknown>;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ title, closeModal: onClose }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<CreateMessageGroupRequest>({
    name: '',
    description: '',
    memberIds: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createMessageGroup(formData)).unwrap();
      dispatch(closeModal({}));
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Group
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroupModal; 