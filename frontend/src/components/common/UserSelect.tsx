import React from 'react';
import { Users } from 'lucide-react';

interface UserSelectProps {
  label: string;
  required?: boolean;
}

export function UserSelect({ label, required }: UserSelectProps) {
  const users = [
    { id: 1, name: 'Sarah Chen', role: 'Senior Geologist' },
    { id: 2, name: 'Michael Torres', role: 'Project Manager' },
    { id: 3, name: 'Emma Wilson', role: 'Field Geologist' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Users className="h-5 w-5 text-gray-400" />
        </div>
        <select
          required={required}
          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select a team member</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} - {user.role}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}