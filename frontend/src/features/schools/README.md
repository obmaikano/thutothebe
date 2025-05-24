# Schools Feature

This feature handles all school management functionality in the application.

## Structure

```
schools/
├── README.md                 # This file
├── index.tsx                # Feature entry point
├── schoolsSlice.ts          # Redux slice for state management
├── pages/                   # Page components
│   └── SchoolListPage.tsx   # Main schools listing page
├── components/              # Reusable components (to be added)
└── modals/                  # Modal components (to be added)
```

## State Management

The schools feature uses Redux Toolkit for state management with the following structure:

### State Shape
```typescript
interface SchoolsState {
  schools: School[];
  currentSchool: School | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
```

### Available Actions
- `fetchSchools` - Get all schools
- `fetchSchoolById` - Get school by ID
- `fetchSchoolByCode` - Get school by code
- `fetchSchoolsByRegionId` - Get schools by region
- `fetchActiveSchoolsByRegionId` - Get active schools by region
- `createSchool` - Create new school
- `updateSchool` - Update existing school
- `deleteSchool` - Delete school
- `activateSchool` - Activate school
- `deactivateSchool` - Deactivate school
- `clearCurrentSchool` - Clear current school from state
- `clearSchoolsError` - Clear error state

## API Integration

The feature integrates with the backend through the `schoolApi` service which provides:
- Full CRUD operations
- School activation/deactivation
- Region-based filtering
- Code-based lookup

## Pages

### SchoolListPage
- Displays all schools in a table format
- Provides search and filtering capabilities
- Shows statistics (total, active, inactive schools)
- Handles school creation, editing, and deletion through modals
- Supports activation/deactivation of schools
- Includes region-based filtering

## Usage

```typescript
import SchoolListPage from './features/schools';

// Use in routing
<Route path="/schools" component={SchoolListPage} />
```

## Dependencies

- React
- Redux Toolkit
- Lucide React (for icons)
- Tailwind CSS (for styling)
- School API service
- Region API service (for region filtering)

## Future Enhancements

- School detail page
- School form components
- School assignment modals
- Bulk operations
- Export functionality
- Advanced filtering options 