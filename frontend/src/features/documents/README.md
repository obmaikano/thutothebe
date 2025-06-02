# Document Management System

A comprehensive document management system for educational institutions with professional-grade features including searchable dropdowns, role-based access control, and real-time backend integration.

## Features

### Core Functionality
- **Document Upload & Management**: Multi-file upload with drag-and-drop support
- **Document Library**: Browse, search, and filter documents with advanced controls
- **Version Control**: Track document versions and changes
- **Access Control**: Role-based permissions and document-level access control
- **Document Association**: Link documents to schools, classes, subjects, and courses
- **Real-time Search**: Live search across document metadata and content

### Professional UI Components
- **Searchable Dropdowns**: Professional searchable dropdown components for all reference entities
- **Live Data Integration**: Real-time data fetching from backend APIs
- **Responsive Design**: Mobile-friendly interface with DaisyUI components
- **Advanced Filtering**: Multi-criteria filtering with live updates
- **Bulk Operations**: Select and manage multiple documents simultaneously

## Architecture

### File Structure
```
src/features/documents/
├── components/
│   ├── SearchableSchoolSelect.tsx      # School selection dropdown
│   ├── SearchableClassSelect.tsx       # Class selection dropdown
│   ├── SearchableSubjectSelect.tsx     # Subject selection dropdown
│   ├── SearchableCourseSelect.tsx      # Course selection dropdown
│   ├── DocumentCard.tsx                # Document display card
│   ├── DocumentUploader.tsx            # File upload component
│   ├── DocumentViewer.tsx              # Document preview
│   ├── DocumentFilters.tsx             # Search and filter controls
│   └── DocumentStats.tsx               # Document statistics
├── pages/
│   ├── DocumentLibraryPage.tsx         # Main document library
│   ├── DocumentUploadPage.tsx          # Document upload interface
│   ├── MyDocumentsPage.tsx             # User's documents
│   └── DocumentDetailsPage.tsx         # Document details view
├── modals/
│   ├── DocumentUploadModal.tsx         # Quick upload modal
│   ├── DocumentEditModal.tsx           # Edit document metadata
│   ├── DocumentViewModal.tsx           # View document details
│   └── DocumentDeleteModal.tsx         # Delete confirmation
├── documentsSlice.ts                   # Redux state management
├── README.md                           # This file
└── index.tsx                           # Feature exports
```

### API Integration
The system integrates with multiple backend APIs:
- **Document API**: Document CRUD operations and file management
- **School API**: School data for dropdown selections
- **Class API**: Class data with school filtering
- **Subject API**: Subject data for categorization
- **Course API**: Course data with class/subject filtering

### State Management
Uses Redux Toolkit for state management with:
- Document list and pagination
- Upload progress tracking
- Search and filter state
- Selected documents for bulk operations
- Error handling and loading states

## Searchable Dropdown Components

### Features
- **Live Search**: Real-time filtering as you type
- **Keyboard Navigation**: Full keyboard accessibility
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: Graceful error handling with user feedback
- **Dependency Management**: Automatic clearing of dependent selections
- **Professional UI**: Consistent styling with hover and focus states

### SearchableSchoolSelect
```tsx
<SearchableSchoolSelect
  value={selectedSchoolId}
  onChange={setSelectedSchoolId}
  placeholder="Select a school..."
  regionId={regionId}           // Optional: filter by region
  showActiveOnly={true}         // Show only active schools
  error={errorMessage}          // Display validation errors
/>
```

### SearchableClassSelect
```tsx
<SearchableClassSelect
  value={selectedClassId}
  onChange={setSelectedClassId}
  placeholder="Select a class..."
  schoolId={selectedSchoolId}   // Required: filter by school
  showActiveOnly={true}
/>
```

### SearchableSubjectSelect
```tsx
<SearchableSubjectSelect
  value={selectedSubjectId}
  onChange={setSelectedSubjectId}
  placeholder="Select a subject..."
  showActiveOnly={true}
/>
```

### SearchableCourseSelect
```tsx
<SearchableCourseSelect
  value={selectedCourseId}
  onChange={setSelectedCourseId}
  placeholder="Select a course..."
  classId={selectedClassId}     // Optional: filter by class
  subjectId={selectedSubjectId} // Optional: filter by subject
  showActiveOnly={true}
/>
```

## Role-Based Access Control

### User Roles and Permissions

#### SUPER_ADMIN
- Full access to all documents
- Can upload, edit, delete any document
- Can approve/reject documents
- Can manage bulk operations
- Access to all schools and regions

#### SCHOOL_ADMIN
- Access to school-specific documents
- Can upload and manage school documents
- Can approve documents for their school
- Limited to their assigned school

#### DEPARTMENT_HEAD / SENIOR_TEACHER
- Can upload and manage department documents
- Can approve documents in their department
- Access to class and subject-specific documents

#### TEACHER
- Can upload teaching materials
- Can access class-specific documents
- Limited editing rights to own documents

#### STUDENT / PARENT
- Read-only access to public documents
- Access to class-specific resources
- Cannot upload or modify documents

## Document Categories

- **CURRICULUM**: Curriculum documents and standards
- **POLICY**: School policies and procedures
- **FORM**: Administrative forms and templates
- **RESOURCE**: Educational resources and materials
- **REPORT**: Reports and analytics
- **ASSIGNMENT**: Student assignments and submissions
- **OTHER**: Miscellaneous documents

## Access Levels

- **PUBLIC**: Accessible by all users
- **SCHOOL**: Accessible by school members
- **CLASS**: Accessible by class members
- **TEACHER**: Accessible by teachers only
- **ADMIN**: Accessible by administrators only
- **PRIVATE**: Accessible by owner only

## Usage Examples

### Document Upload with Associations
```tsx
// Upload a document with full associations
const uploadDocument = async () => {
  const formData = {
    title: "Mathematics Curriculum Guide",
    description: "Comprehensive guide for Grade 10 Mathematics",
    documentCategory: "CURRICULUM",
    accessLevel: "SCHOOL",
    schoolId: selectedSchoolId,
    classId: selectedClassId,
    subjectId: selectedSubjectId,
    courseId: selectedCourseId,
    tags: "mathematics, curriculum, grade10",
    isPublic: false
  };
  
  await dispatch(uploadDocument({ file, metadata: formData }));
};
```

### Advanced Document Search
```tsx
// Search with multiple criteria
const searchDocuments = () => {
  dispatch(searchDocuments({
    searchTerm: "mathematics",
    filters: {
      category: "CURRICULUM",
      accessLevel: "SCHOOL",
      schoolId: selectedSchoolId,
      classId: selectedClassId,
      subjectId: selectedSubjectId
    }
  }));
};
```

### Bulk Document Operations
```tsx
// Bulk approve documents
const bulkApprove = () => {
  const selectedIds = selectedDocuments.map(doc => doc.id);
  dispatch(bulkApproveDocuments(selectedIds));
};
```

## Security Features

### File Upload Security
- File type validation
- Size limit enforcement (50MB default)
- Virus scanning integration ready
- Secure file storage paths

### Access Control
- JWT token validation
- Role-based route protection
- Document-level permissions
- Audit trail logging

### Data Validation
- Zod schema validation
- Input sanitization
- XSS protection
- CSRF protection ready

## Performance Optimizations

### Frontend Optimizations
- Lazy loading for large document lists
- Virtual scrolling for performance
- Debounced search inputs
- Optimistic UI updates
- Image thumbnail caching

### Backend Integration
- Paginated API responses
- Efficient database queries
- Caching strategies
- CDN integration ready

## Mobile Responsiveness

The system is fully responsive with:
- Touch-friendly interfaces
- Mobile-optimized dropdowns
- Responsive grid layouts
- Mobile navigation patterns
- Touch gestures support

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Guidelines

### Adding New Document Types
1. Update the `documentCategory` enum in the schema
2. Add appropriate icons and styling
3. Update role permissions if needed
4. Add to the category filter options

### Extending Search Functionality
1. Add new filter criteria to the Redux state
2. Update the search API integration
3. Add UI controls for new filters
4. Update the search results display

### Adding New Roles
1. Update role-based permission checks
2. Add role-specific UI elements
3. Update navigation and routing
4. Test access control thoroughly

## Testing

### Component Testing
- Unit tests for all searchable dropdowns
- Integration tests for document operations
- Accessibility testing
- Cross-browser testing

### API Testing
- Mock API responses for development
- Error handling scenarios
- Performance testing
- Security testing

## Future Enhancements

### Planned Features
- Document collaboration tools
- Advanced analytics dashboard
- AI-powered document categorization
- Integration with external storage
- Advanced workflow management

### Technical Improvements
- Progressive Web App (PWA) support
- Offline document access
- Real-time collaboration
- Advanced caching strategies
- Performance monitoring

## Troubleshooting

### Common Issues

#### Dropdown Not Loading Data
- Check network connectivity
- Verify API endpoints are accessible
- Check user permissions
- Review browser console for errors

#### Upload Failures
- Verify file size limits
- Check file type restrictions
- Ensure proper authentication
- Review server logs

#### Search Not Working
- Check search term formatting
- Verify filter combinations
- Clear browser cache
- Check API response format

### Debug Mode
Enable debug mode by setting `NODE_ENV=development` to see:
- Detailed error messages
- API request/response logs
- Performance metrics
- State change logs

## Contributing

When contributing to the document management system:

1. Follow the established component patterns
2. Maintain TypeScript type safety
3. Add proper error handling
4. Include accessibility features
5. Write comprehensive tests
6. Update documentation

## License

This document management system is part of the educational management platform and follows the same licensing terms. 