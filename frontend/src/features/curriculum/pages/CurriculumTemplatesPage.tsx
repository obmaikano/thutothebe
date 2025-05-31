import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCurricula, clearCurriculumError, duplicateCurriculum } from '../curriculumSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Curriculum } from '../../../api/services/curriculumApi';
import { Search, Plus, BookOpen, Copy, Eye, Download, Upload, Filter, Grid, List } from 'lucide-react';

const CurriculumTemplatesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { curricula, status, error } = useAppSelector(state => state.curriculum);
  const { user } = useAppSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [gradeLevelFilter, setGradeLevelFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    dispatch(fetchCurricula());
    return () => {
      dispatch(clearCurriculumError());
    };
  }, [dispatch]);

  const handleCreateTemplate = () => {
    dispatch(openModal({
      title: 'Create Curriculum Template',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_ADD_NEW,
      size: 'lg'
    }));
  };

  const handleViewTemplate = (curriculum: Curriculum) => {
    dispatch(openModal({
      title: 'Template Details',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_VIEW,
      extraObject: { curriculum },
      size: 'lg'
    }));
  };

  const handleUseTemplate = (curriculum: Curriculum) => {
    dispatch(openModal({
      title: 'Use Template',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_DUPLICATE,
      extraObject: { curriculum },
      size: 'lg'
    }));
  };

  const handleImportTemplate = () => {
    dispatch(openModal({
      title: 'Import Template',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_ADD_NEW, // We'll need to create specific import modal
      size: 'lg'
    }));
  };

  const canManageTemplates = user && [
    'MINISTRY_STAFF',
    'MINISTRY_EXECUTIVE',
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'SCHOOL_ADMIN',
    'SUPER_ADMIN'
  ].includes(user.role);

  // Filter curricula to show only templates or approved curricula that can be used as templates
  const templateCurricula = curricula.filter((curriculum: Curriculum) => {
    const isTemplate = curriculum.status === 'APPROVED' || curriculum.status === 'ACTIVE';
    
    const matchesSearch = 
      curriculum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (curriculum.description && curriculum.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = 
      typeFilter === '' || curriculum.curriculumType === typeFilter;

    const matchesGradeLevel = 
      gradeLevelFilter === '' || curriculum.gradeLevel === gradeLevelFilter;

    return isTemplate && matchesSearch && matchesType && matchesGradeLevel;
  });

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'NATIONAL': { color: 'bg-purple-100 text-purple-800', label: 'National' },
      'REGIONAL': { color: 'bg-blue-100 text-blue-800', label: 'Regional' },
      'SCHOOL_SPECIFIC': { color: 'bg-green-100 text-green-800', label: 'School-Based' },
      'INTERNATIONAL': { color: 'bg-indigo-100 text-indigo-800', label: 'International' },
      'VOCATIONAL': { color: 'bg-orange-100 text-orange-800', label: 'Vocational' },
      'SPECIAL_NEEDS': { color: 'bg-pink-100 text-pink-800', label: 'Special Needs' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.NATIONAL;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'APPROVED': { color: 'bg-green-100 text-green-800', label: 'Approved' },
      'ACTIVE': { color: 'bg-blue-100 text-blue-800', label: 'Active' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.APPROVED;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const renderTemplateCard = (curriculum: Curriculum) => (
    <div key={curriculum.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{curriculum.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{curriculum.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {getTypeBadge(curriculum.curriculumType)}
            {getStatusBadge(curriculum.status)}
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
              {curriculum.gradeLevel.replace('_', ' ')}
            </span>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {curriculum.academicYear}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {curriculum.durationWeeks && (
            <span>{curriculum.durationWeeks} weeks • </span>
          )}
          {curriculum.totalHours && (
            <span>{curriculum.totalHours} hours</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewTemplate(curriculum)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleUseTemplate(curriculum)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Use Template"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderTemplateRow = (curriculum: Curriculum) => (
    <tr key={curriculum.id} className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div>
          <div className="font-medium text-gray-900">{curriculum.title}</div>
          <div className="text-sm text-gray-500 line-clamp-1">{curriculum.description}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        {getTypeBadge(curriculum.curriculumType)}
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">
          {curriculum.gradeLevel.replace('_', ' ')}
        </span>
      </td>
      <td className="px-6 py-4">
        {getStatusBadge(curriculum.status)}
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">{curriculum.academicYear}</span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-500">
          {curriculum.durationWeeks && (
            <div>{curriculum.durationWeeks} weeks</div>
          )}
          {curriculum.totalHours && (
            <div>{curriculum.totalHours} hours</div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewTemplate(curriculum)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleUseTemplate(curriculum)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Use Template"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Curriculum Templates</h1>
          <p className="text-gray-600 mt-2">Browse and use approved curriculum templates to accelerate development</p>
        </div>
        <div className="flex items-center gap-3">
          {canManageTemplates && (
            <>
              <button 
                onClick={handleImportTemplate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button 
                onClick={handleCreateTemplate} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Template
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="NATIONAL">National</option>
              <option value="REGIONAL">Regional</option>
              <option value="SCHOOL_SPECIFIC">School-Based</option>
              <option value="INTERNATIONAL">International</option>
              <option value="VOCATIONAL">Vocational</option>
              <option value="SPECIAL_NEEDS">Special Needs</option>
            </select>

            <select
              value={gradeLevelFilter}
              onChange={(e) => setGradeLevelFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Grades</option>
              <option value="PRE_KINDERGARTEN">Pre-Kindergarten</option>
              <option value="KINDERGARTEN">Kindergarten</option>
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
              <option value="FORM_6">Form 6</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'} hover:bg-gray-50 transition-colors`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'} hover:bg-gray-50 transition-colors border-l border-gray-300`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Content */}
      {templateCurricula.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templateCurricula.map(renderTemplateCard)}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {templateCurricula.map(renderTemplateRow)}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Templates Found</h2>
          <p className="text-gray-600 mb-4">
            {searchTerm || typeFilter || gradeLevelFilter
              ? 'No curriculum templates match your current filters.'
              : 'No approved curriculum templates are available yet.'}
          </p>
          {(searchTerm || typeFilter || gradeLevelFilter) && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('');
                setGradeLevelFilter('');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          )}
          {canManageTemplates && !searchTerm && !typeFilter && !gradeLevelFilter && (
            <div className="mt-4">
              <button 
                onClick={handleCreateTemplate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create First Template
              </button>
            </div>
          )}
        </div>
      )}

      {/* Statistics */}
      {templateCurricula.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{templateCurricula.length}</div>
              <div className="text-sm text-gray-600">Total Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {templateCurricula.filter(c => c.curriculumType === 'NATIONAL').length}
              </div>
              <div className="text-sm text-gray-600">National</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {templateCurricula.filter(c => c.curriculumType === 'REGIONAL').length}
              </div>
              <div className="text-sm text-gray-600">Regional</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {templateCurricula.filter(c => c.curriculumType === 'SCHOOL_SPECIFIC').length}
              </div>
              <div className="text-sm text-gray-600">School-Based</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumTemplatesPage; 