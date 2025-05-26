import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Settings, Save, School, Calendar, 
  Clock, Users, Bell, Shield,
  Globe, Mail, Phone, MapPin,
  BookOpen, Award, AlertCircle
} from 'lucide-react';

// Card component
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

// Setting Section component
const SettingSection: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, description, icon, children }) => (
  <Card>
    <div className="flex items-start gap-3 mb-4">
      <div className="p-2 bg-blue-100 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
    {children}
  </Card>
);

export const SchoolSettingsPage: React.FC = () => {
  const { user } = useAuth();
  
  // School Information State
  const [schoolInfo, setSchoolInfo] = useState({
    name: 'Gaborone Secondary School',
    address: '123 Education Drive, Gaborone, Botswana',
    phone: '+267 123 4567',
    email: 'admin@gaboronesecondary.edu.bw',
    website: 'www.gaboronesecondary.edu.bw',
    principalName: 'Dr. Sarah Moeti',
    establishedYear: '1985',
    motto: 'Excellence in Education',
    vision: 'To be a leading institution in providing quality education that prepares students for the challenges of the 21st century.',
    mission: 'To provide comprehensive education that develops critical thinking, creativity, and character in our students.'
  });

  // Academic Settings State
  const [academicSettings, setAcademicSettings] = useState({
    currentAcademicYear: '2025',
    termSystem: '3-term',
    gradingSystem: 'A-F',
    passingGrade: 'D',
    maxStudentsPerClass: '35',
    schoolStartTime: '07:30',
    schoolEndTime: '15:30',
    lunchBreakDuration: '60',
    periodDuration: '45'
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    parentNotifications: true,
    attendanceAlerts: true,
    gradeNotifications: true,
    eventReminders: true,
    systemMaintenance: true
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    passwordPolicy: 'strong',
    sessionTimeout: '30',
    twoFactorAuth: false,
    loginAttempts: '3',
    accountLockDuration: '15',
    dataRetention: '7'
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSchoolInfoChange = (field: string, value: string) => {
    setSchoolInfo(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleAcademicSettingsChange = (field: string, value: string) => {
    setAcademicSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSecurityChange = (field: string, value: string | boolean) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Settings saved:', {
        schoolInfo,
        academicSettings,
        notificationSettings,
        securitySettings
      });
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">School Settings</h1>
          <p className="text-gray-600 mt-2">Configure school information, academic settings, and system preferences</p>
        </div>
        <button 
          onClick={handleSaveSettings}
          disabled={!hasChanges || saving}
          className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            hasChanges && !saving
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Changes Alert */}
      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} />
          <span>You have unsaved changes. Don't forget to save your settings.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* School Information */}
        <SettingSection
          title="School Information"
          description="Basic information about your school"
          icon={<School size={20} />}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
              <input
                type="text"
                value={schoolInfo.name}
                onChange={(e) => handleSchoolInfoChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={schoolInfo.address}
                onChange={(e) => handleSchoolInfoChange('address', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={schoolInfo.phone}
                  onChange={(e) => handleSchoolInfoChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={schoolInfo.email}
                  onChange={(e) => handleSchoolInfoChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                value={schoolInfo.website}
                onChange={(e) => handleSchoolInfoChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Principal Name</label>
              <input
                type="text"
                value={schoolInfo.principalName}
                onChange={(e) => handleSchoolInfoChange('principalName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </SettingSection>

        {/* Academic Settings */}
        <SettingSection
          title="Academic Settings"
          description="Configure academic year, terms, and grading"
          icon={<BookOpen size={20} />}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                <input
                  type="text"
                  value={academicSettings.currentAcademicYear}
                  onChange={(e) => handleAcademicSettingsChange('currentAcademicYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Term System</label>
                <select
                  value={academicSettings.termSystem}
                  onChange={(e) => handleAcademicSettingsChange('termSystem', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="2-term">2 Terms</option>
                  <option value="3-term">3 Terms</option>
                  <option value="4-term">4 Terms</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grading System</label>
                <select
                  value={academicSettings.gradingSystem}
                  onChange={(e) => handleAcademicSettingsChange('gradingSystem', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="A-F">A-F Scale</option>
                  <option value="1-7">1-7 Scale</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passing Grade</label>
                <select
                  value={academicSettings.passingGrade}
                  onChange={(e) => handleAcademicSettingsChange('passingGrade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="D">D</option>
                  <option value="C">C</option>
                  <option value="50%">50%</option>
                  <option value="60%">60%</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Students per Class</label>
              <input
                type="number"
                value={academicSettings.maxStudentsPerClass}
                onChange={(e) => handleAcademicSettingsChange('maxStudentsPerClass', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </SettingSection>

        {/* Schedule Settings */}
        <SettingSection
          title="Schedule Settings"
          description="Configure school hours and class periods"
          icon={<Clock size={20} />}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Start Time</label>
                <input
                  type="time"
                  value={academicSettings.schoolStartTime}
                  onChange={(e) => handleAcademicSettingsChange('schoolStartTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School End Time</label>
                <input
                  type="time"
                  value={academicSettings.schoolEndTime}
                  onChange={(e) => handleAcademicSettingsChange('schoolEndTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Period Duration (minutes)</label>
                <input
                  type="number"
                  value={academicSettings.periodDuration}
                  onChange={(e) => handleAcademicSettingsChange('periodDuration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lunch Break (minutes)</label>
                <input
                  type="number"
                  value={academicSettings.lunchBreakDuration}
                  onChange={(e) => handleAcademicSettingsChange('lunchBreakDuration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </SettingSection>

        {/* Notification Settings */}
        <SettingSection
          title="Notification Settings"
          description="Configure system notifications and alerts"
          icon={<Bell size={20} />}
        >
          <div className="space-y-4">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleNotificationChange(key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </SettingSection>
      </div>

      {/* Security Settings */}
      <SettingSection
        title="Security Settings"
        description="Configure security policies and access controls"
        icon={<Shield size={20} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Policy</label>
            <select
              value={securitySettings.passwordPolicy}
              onChange={(e) => handleSecurityChange('passwordPolicy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="basic">Basic (8+ characters)</option>
              <option value="strong">Strong (8+ chars, mixed case, numbers)</option>
              <option value="very-strong">Very Strong (12+ chars, symbols)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
            <input
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
            <input
              type="number"
              value={securitySettings.loginAttempts}
              onChange={(e) => handleSecurityChange('loginAttempts', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Lock Duration (minutes)</label>
            <input
              type="number"
              value={securitySettings.accountLockDuration}
              onChange={(e) => handleSecurityChange('accountLockDuration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Retention (years)</label>
            <input
              type="number"
              value={securitySettings.dataRetention}
              onChange={(e) => handleSecurityChange('dataRetention', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.twoFactorAuth}
                onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </SettingSection>
    </div>
  );
}; 