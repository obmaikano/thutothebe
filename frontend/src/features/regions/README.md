# Regions Feature

This feature handles all region management functionality in the application.

## Structure

```
regions/
├── README.md                 # This file
├── index.tsx                # Feature entry point
├── regionsSlice.ts          # Redux slice for state management
├── pages/                   # Page components
│   └── RegionListPage.tsx   # Main regions listing page
├── components/              # Reusable components (to be added)
└── modals/                  # Modal components (to be added)
```

## State Management

The regions feature uses Redux Toolkit for state management with the following structure:

### State Shape
```typescript
interface RegionsState {
  regions: Region[];
  currentRegion: Region | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
```

### Available Actions
- `fetchRegions` - Get all regions
- `fetchRegionById` - Get region by ID
- `fetchRegionByCode` - Get region by code
- `fetchActiveRegions` - Get all active regions
- `createRegion` - Create new region
- `updateRegion` - Update existing region
- `deleteRegion` - Delete region
- `activateRegion` - Activate region
- `deactivateRegion` - Deactivate region
- `clearCurrentRegion` - Clear current region from state
- `clearRegionsError` - Clear error state

## API Integration

The feature integrates with the backend through the `regionApi` service which provides:
- Full CRUD operations
- Region activation/deactivation
- Active regions filtering
- Code-based lookup

## Pages

### RegionListPage
- Displays all regions in a table format
- Provides search and filtering capabilities
- Shows statistics (total, active, inactive regions)
- Handles region creation, editing, and deletion through modals
- Supports activation/deactivation of regions

## Usage

```typescript
import RegionListPage from './features/regions';

// Use in routing
<Route path="/regions" component={RegionListPage} />
```

## Dependencies

- React
- Redux Toolkit
- Lucide React (for icons)
- Tailwind CSS (for styling)
- Region API service

## Future Enhancements

- Region detail page
- Region form components
- Region assignment modals
- Bulk operations
- Export functionality
- Advanced filtering options
- School count per region
- Performance metrics per region 