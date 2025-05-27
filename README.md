# ThutoLMS - National Learning Management System

## 🎯 Overview

ThutoLMS is a comprehensive Learning Management System designed specifically for Botswana's public schools. The system provides role-based access for different stakeholders including system administrators, school administrators, teachers, and students.

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- Lucide React for icons
- React Router for navigation

**Backend:**
- Java Spring Boot 3 with Maven
- Java 17
- Spring Web, Spring Data JPA
- PostgreSQL database
- Thymeleaf templating
- Lombok for boilerplate reduction

### Design Principles
- **SOLID Principles** - Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **DRY (Don't Repeat Yourself)** - Code reusability and maintainability
- **KISS (Keep It Simple, Stupid)** - Simple, clean solutions
- **YAGNI (You Aren't Gonna Need It)** - Implement only what's needed
- **OWASP Security Best Practices** - Secure coding standards

## 🎭 User Roles

### 1. System Administrator
- Manage regions and schools
- User management across the system
- System-wide configuration
- National-level reporting

### 2. School Administrator
- **Class and Timetable Setup** - Create and manage class schedules
- **Subject and Course Allocation** - Assign subjects to teachers
- **Assessment Configuration** - Create and manage assessments
- **School-Level Reports** - Performance and attendance analytics
- **School Configuration** - School settings and admin delegates

### 3. Teacher
- Course content management
- Student assessment and grading
- Class attendance tracking
- Student progress monitoring

### 4. Student
- Access course materials
- Submit assignments
- View grades and feedback
- Track personal progress

## 🚀 Recent Implementation: School Admin Features

### Core Modules Implemented

#### 1. 🕒 Timetable Management
**File:** `frontend/src/features/school_admin/pages/TimetableManagementPage.tsx`

**Features:**
- Interactive weekly grid view with drag-and-drop
- Time conflict detection and resolution
- Class filtering and search functionality
- Statistics dashboard (schedules, classes, teachers, conflicts)
- Week navigation controls
- Export functionality

**Technical Implementation:**
- Redux state management with `schedulesSlice.ts`
- Enhanced API services in `scheduleApi.ts`
- Responsive design with Tailwind CSS
- Real-time conflict checking

#### 2. 📝 Assessment Configuration
**File:** `frontend/src/features/school_admin/pages/AssessmentConfigurationPage.tsx`

**Features:**
- Assessment creation and management interface
- Card-based layout with filtering capabilities
- Statistics overview (total, active, draft, completed)
- Progress tracking with submissions and scores
- Grading scheme configuration

**Technical Implementation:**
- Mock data structure for assessments
- Filtering system by type, status, and class
- Interactive cards with hover effects
- Responsive grid layout

#### 3. 👨‍🏫 Subject Allocation
**File:** `frontend/src/features/school_admin/pages/SubjectAllocationPage.tsx`

**Features:**
- Subject-to-teacher allocation management
- Teacher workload visualization (light/moderate/heavy)
- Progress tracking for curriculum delivery
- Bulk allocation functionality
- Workload distribution analysis

**Technical Implementation:**
- Teacher workload calculation algorithms
- Color-coded workload indicators
- Progress bars for curriculum delivery
- Filtering and search capabilities

### Technical Architecture

#### Redux Store Integration
```typescript
// Store configuration
export const store = configureStore({
  reducer: {
    // ... existing reducers
    schedules: schedulesReducer,
  },
});
```

#### API Services Enhancement
```typescript
// Schedule API endpoints
scheduleApi.getAll()
scheduleApi.getBySchool(schoolId)
scheduleApi.create(scheduleData)
scheduleApi.checkTimeConflicts(params)
scheduleApi.bulkUpdate(scheduleIds, updateData)
```

#### Route Configuration
```typescript
// Protected routes for school admin
{
  path: 'timetable',
  element: TimetableManagement
},
{
  path: 'assessments', 
  element: AssessmentConfiguration
},
{
  path: 'subject-allocation',
  element: SubjectAllocation
}
```

## 📁 Project Structure

```
thutothebe/
├── frontend/                          # React frontend application
│   ├── src/
│   │   ├── api/                      # API service layer
│   │   │   └── services/             # Individual API services
│   │   ├── components/               # Reusable UI components
│   │   ├── features/                 # Feature-based modules
│   │   │   ├── school_admin/         # School admin feature
│   │   │   │   ├── pages/           # Page components
│   │   │   │   └── schedulesSlice.ts # Redux state management
│   │   │   ├── subjects/            # Subjects feature
│   │   │   └── students/            # Students feature
│   │   ├── pages/                   # Route page wrappers
│   │   │   └── protected/           # Protected route pages
│   │   ├── routes/                  # Routing configuration
│   │   ├── store/                   # Redux store setup
│   │   └── utils/                   # Utility functions
│   ├── package.json                 # Frontend dependencies
│   └── tailwind.config.js          # Tailwind CSS configuration
├── backend/                         # Spring Boot backend (if applicable)
├── docs/                           # Documentation
├── SCHOOL_ADMIN_IMPLEMENTATION.md  # Technical implementation guide
├── SCHOOL_ADMIN_USER_GUIDE.md     # User guide for school admins
└── README.md                       # This file
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm
- Java 17+ (for backend)
- PostgreSQL 13+
- Git

### Frontend Setup
```bash
# Clone the repository
git clone <repository-url>
cd thutothebe

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies and run
./mvnw spring-boot:run
```

### Database Setup
```sql
-- Create database
CREATE DATABASE thutolms;

-- Configure connection in application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/thutolms
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## 🎨 UI/UX Design System

### Design Principles
- **Mobile-first responsive design**
- **Consistent color scheme** with blue primary colors
- **Card-based layouts** for content organization
- **Interactive elements** with hover and focus states
- **Accessibility compliance** with WCAG guidelines

### Component Patterns
```typescript
// Card component pattern
const Card: React.FC<{ children: React.ReactNode, className?: string }> = 
  ({ children, className = '' }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );

// Statistics card pattern
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconColor, onClick }) => (
  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
    {/* Card content */}
  </Card>
);
```

### Color Scheme
- **Primary:** Blue (#3B82F6)
- **Secondary:** Gray (#6B7280)
- **Success:** Green (#10B981)
- **Warning:** Yellow (#F59E0B)
- **Error:** Red (#EF4444)

## 🔒 Security Implementation

### Authentication & Authorization
- **Role-based access control (RBAC)**
- **JWT token authentication**
- **Route protection** based on user roles
- **API endpoint security** with permission checks

### Input Validation
- **Client-side validation** with TypeScript interfaces
- **Server-side validation** for all API endpoints
- **Input sanitization** to prevent XSS attacks
- **SQL injection prevention** with parameterized queries

### Error Handling
```typescript
// Global exception handler pattern
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<OhmaApiResponse<?>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return new ResponseEntity<>(OhmaApiResponse.error(400, ex.getMessage()), HttpStatus.BAD_REQUEST);
    }
}
```

## 📊 Performance Optimization

### Frontend Optimizations
- **Lazy loading** for route components
- **Code splitting** by feature modules
- **Memoization** for expensive calculations
- **Virtual scrolling** for large data sets
- **Image optimization** and compression

### Backend Optimizations
- **Database indexing** for frequently queried fields
- **Query optimization** with JPA and JPQL
- **Caching strategies** for static data
- **Connection pooling** for database connections

## 🧪 Testing Strategy

### Frontend Testing
```typescript
// Component testing example
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { TimetableManagementPage } from './TimetableManagementPage';

describe('TimetableManagementPage', () => {
  it('renders timetable grid', () => {
    render(
      <Provider store={mockStore}>
        <TimetableManagementPage />
      </Provider>
    );
    expect(screen.getByText('Timetable Management')).toBeInTheDocument();
  });
});
```

### Backend Testing
- **Unit tests** for service layer methods
- **Integration tests** for API endpoints
- **Repository tests** for data access layer
- **Security tests** for authentication and authorization

## 🚀 Deployment

### Build Process
```bash
# Frontend production build
cd frontend
npm run build

# Backend JAR build
cd backend
./mvnw clean package
```

### Environment Configuration
- **Development:** Local development with hot reload
- **Staging:** Testing environment with sample data
- **Production:** Live environment with SSL and monitoring

### Docker Deployment (Optional)
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Monitoring & Analytics

### Performance Monitoring
- **Application performance monitoring (APM)**
- **Database query performance tracking**
- **Frontend bundle size monitoring**
- **User experience metrics**

### Error Tracking
- **Centralized error logging**
- **Real-time error notifications**
- **Error trend analysis**
- **User feedback integration**

## 🔄 Future Roadmap

### Planned Features
1. **Real-time Updates** - WebSocket integration for live updates
2. **Mobile Application** - Native mobile app for iOS and Android
3. **Advanced Analytics** - Machine learning for predictive analytics
4. **Offline Support** - Progressive Web App (PWA) capabilities
5. **Integration APIs** - Third-party system integrations

### Placeholder Pages (Ready for Development)
- **Facilities Management** (`/app/facilities`)
- **School Calendar** (`/app/school-calendar`)
- **Attendance Tracking** (`/app/attendance`)
- **Documents Management** (`/app/documents`)
- **School Monitoring** (`/app/monitoring`)

## 📚 Documentation

### Available Documentation
- **[Technical Implementation Guide](SCHOOL_ADMIN_IMPLEMENTATION.md)** - Detailed technical documentation
- **[User Guide](SCHOOL_ADMIN_USER_GUIDE.md)** - End-user documentation for school administrators
- **API Documentation** - Available in backend documentation
- **Component Library** - Storybook documentation (if available)

### Code Documentation
- **Inline comments** for complex logic
- **JSDoc comments** for functions and components
- **README files** in feature directories
- **Architecture decision records (ADRs)**

## 🤝 Contributing

### Development Guidelines
1. **Follow established patterns** from existing features
2. **Write comprehensive tests** for new functionality
3. **Update documentation** for any changes
4. **Follow code review process** before merging
5. **Maintain consistency** with design system

### Code Standards
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Conventional commits** for commit messages

### Pull Request Process
1. Create feature branch from `main`
2. Implement changes following established patterns
3. Write/update tests as needed
4. Update documentation
5. Submit pull request with detailed description
6. Address code review feedback
7. Merge after approval

## 📞 Support

### Getting Help
- **Documentation:** Check implementation and user guides
- **Issues:** Use GitHub issues for bug reports
- **Discussions:** Use GitHub discussions for questions
- **Email:** Contact development team directly

### Troubleshooting
- **Build Issues:** Check Node.js and Java versions
- **Runtime Errors:** Check browser console and server logs
- **Performance Issues:** Monitor network requests and database queries
- **Authentication Issues:** Verify user roles and permissions

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Botswana Ministry of Education** - Project sponsorship and requirements
- **Development Team** - Implementation and maintenance
- **School Administrators** - User feedback and testing
- **Open Source Community** - Libraries and frameworks used

---

**ThutoLMS** - Empowering Education in Botswana 🇧🇼

For more information, visit our [documentation](docs/) or contact the development team.

## Features

### Core Modules
- **User Management**: Complete user lifecycle management with role-based access control
- **School & Region Management**: Hierarchical organization structure
- **Class & Course Management**: Academic structure management
- **Calendar Event Management**: Comprehensive school calendar and event management system

### Calendar Event Management
The Calendar Event module provides a robust foundation for managing school-wide calendar events with the following features:

#### Event Types
- **Academic Events**: Term starts/ends, semester management, academic year planning
- **Examination Events**: Exam periods, midterms, finals, assessments
- **Class Events**: Sessions, lectures, tutorials, practicals, lab sessions, field trips
- **Administrative Events**: Staff meetings, parent meetings, board meetings, orientations, graduations
- **Holiday Events**: Public holidays, school holidays, term breaks, study breaks
- **Extracurricular Events**: Sports, cultural events, competitions, club activities, assemblies
- **Special Events**: Emergency closures, maintenance, inspections, training

#### Event Scopes
- **Global**: Visible to all users across all regions and schools
- **Regional**: Visible to all users within a specific region
- **School**: Visible to all users within a specific school
- **Class**: Visible to all users within a specific class
- **Course**: Visible to all users enrolled in a specific course
- **Personal**: Visible only to specific attendees/organizers

#### Key Features
- **Recurring Events**: Support for daily, weekly, monthly, and yearly recurring patterns
- **Role-based Permissions**: Fine-grained access control based on user roles
- **Approval Workflow**: Events can require approval before being published
- **Conflict Detection**: Automatic detection of scheduling conflicts
- **Event Management**: Add/remove attendees and organizers
- **Status Management**: Track event lifecycle (draft, scheduled, ongoing, completed, cancelled)
- **Calendar Views**: Month, week, and day views with user-specific filtering
- **Search & Filtering**: Comprehensive search and filtering capabilities
- **Bulk Operations**: Create, update, and delete multiple events
- **Import/Export**: Calendar data import/export functionality
- **Notifications**: Event reminders and notifications
- **Academic Calendar**: Specialized views for academic planning

## Technology Stack

- **Framework**: Java Spring Boot 3
- **Build Tool**: Maven
- **Java Version**: 17
- **Database**: PostgreSQL
- **Dependencies**:
  - Spring Web
  - Spring Data JPA
  - Thymeleaf
  - Lombok
  - PostgreSQL Driver

## Architecture

The application follows clean architecture principles with clear separation of concerns:

### Layer Structure
- **Entity Layer**: JPA entities extending BaseEntity
- **Repository Layer**: JPA repositories with custom queries
- **Service Layer**: Business logic implementation extending BaseService
- **Controller Layer**: REST endpoints extending BaseController
- **DTO Layer**: Data transfer objects as records with validation
- **Mapper Layer**: Entity-DTO mapping implementing BaseDtoMapper

### Design Patterns
- **SOLID Principles**: Single responsibility, open/closed, dependency inversion
- **DRY Principle**: Don't repeat yourself
- **KISS Principle**: Keep it simple, stupid
- **YAGNI Principle**: You aren't gonna need it

## API Documentation

### Calendar Event Endpoints

#### Basic CRUD Operations
- `GET /api/calendar-events` - Get all events (paginated)
- `GET /api/calendar-events/{id}` - Get event by ID
- `POST /api/calendar-events` - Create new event
- `PUT /api/calendar-events/{id}` - Update event
- `DELETE /api/calendar-events/{id}` - Delete event

#### Date Range Queries
- `GET /api/calendar-events/date-range?startTime={start}&endTime={end}` - Get events between dates
- `GET /api/calendar-events/date-range/paginated` - Get events between dates (paginated)

#### Scope-based Queries
- `GET /api/calendar-events/scope/{scope}` - Get events by scope
- `GET /api/calendar-events/global` - Get global events
- `GET /api/calendar-events/region/{regionId}` - Get regional events
- `GET /api/calendar-events/school/{regionId}/{schoolId}` - Get school events
- `GET /api/calendar-events/class/{regionId}/{schoolId}/{classId}` - Get class events

#### User-specific Queries
- `GET /api/calendar-events/user/{userId}` - Get all user events
- `GET /api/calendar-events/user/{userId}/created` - Get events created by user
- `GET /api/calendar-events/user/{userId}/attending` - Get events user is attending
- `GET /api/calendar-events/user/{userId}/organizing` - Get events user is organizing

#### Time-based Queries
- `GET /api/calendar-events/upcoming` - Get upcoming events
- `GET /api/calendar-events/today` - Get today's events
- `GET /api/calendar-events/this-week` - Get this week's events

#### Event Management
- `POST /api/calendar-events/{eventId}/attendees/{userId}` - Add attendee
- `DELETE /api/calendar-events/{eventId}/attendees/{userId}` - Remove attendee
- `POST /api/calendar-events/{eventId}/organizers/{userId}` - Add organizer
- `DELETE /api/calendar-events/{eventId}/organizers/{userId}` - Remove organizer

#### Status Management
- `PUT /api/calendar-events/{eventId}/status/ongoing` - Mark as ongoing
- `PUT /api/calendar-events/{eventId}/status/completed` - Mark as completed
- `PUT /api/calendar-events/{eventId}/cancel?reason={reason}` - Cancel event
- `PUT /api/calendar-events/{eventId}/postpone` - Postpone event
- `PUT /api/calendar-events/{eventId}/reschedule` - Reschedule event

#### Approval Workflow
- `GET /api/calendar-events/pending-approval` - Get pending approval events
- `PUT /api/calendar-events/{eventId}/approve` - Approve event
- `PUT /api/calendar-events/{eventId}/reject` - Reject event

#### Calendar Views
- `GET /api/calendar-events/calendar-view/{userId}` - Get calendar view events
- `GET /api/calendar-events/month/{userId}/{year}/{month}` - Get month events

#### Academic Calendar
- `GET /api/calendar-events/academic-year/{year}` - Get academic year events
- `GET /api/calendar-events/holidays` - Get holiday events
- `GET /api/calendar-events/exams` - Get exam events

#### Search & Statistics
- `GET /api/calendar-events/search?searchTerm={term}` - Search events
- `GET /api/calendar-events/statistics/school/{schoolId}/count` - Get event count by school
- `GET /api/calendar-events/{eventId}/conflicts` - Find conflicting events

#### Bulk Operations
- `POST /api/calendar-events/bulk` - Create bulk events
- `DELETE /api/calendar-events/bulk` - Delete bulk events

#### Export
- `GET /api/calendar-events/export` - Export events to calendar format
- `GET /api/calendar-events/export/user/{userId}` - Export user calendar

## Security

Role-based access control with the following permissions:
- **SUPER_ADMIN**: Full system access
- **MINISTRY_EXECUTIVE**: Ministry-level operations
- **REGIONAL_ADMIN**: Regional-level management
- **SCHOOL_ADMIN/SCHOOL_HEAD**: School-level management
- **DEPARTMENT_HEAD/SENIOR_TEACHER/TEACHER**: Class and course-level operations
- **STUDENT**: Limited read access

## Database Schema

### Calendar Events Table
```sql
CREATE TABLE calendar_events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location VARCHAR(200),
    event_type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    scope VARCHAR(20) NOT NULL,
    is_all_day BOOLEAN NOT NULL DEFAULT FALSE,
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    recurrence_rule VARCHAR(500),
    recurrence_end_date TIMESTAMP,
    color VARCHAR(7) DEFAULT '#3B82F6',
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    created_by BIGINT NOT NULL REFERENCES users(id),
    school_id BIGINT REFERENCES schools(id),
    region_id BIGINT REFERENCES regions(id),
    class_id BIGINT REFERENCES classes(id),
    course_id BIGINT REFERENCES courses(id),
    requires_approval BOOLEAN NOT NULL DEFAULT FALSE,
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMP,
    approval_notes TEXT,
    max_attendees INTEGER,
    registration_required BOOLEAN NOT NULL DEFAULT FALSE,
    registration_deadline TIMESTAMP,
    external_link VARCHAR(500),
    meeting_link VARCHAR(500),
    notes TEXT,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    reminder_minutes INTEGER,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    parent_event_id BIGINT REFERENCES calendar_events(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

Comprehensive unit tests are provided for the service layer covering:
- CRUD operations
- Date range queries
- Scope-based filtering
- User-specific operations
- Event management
- Status transitions
- Approval workflow
- Conflict detection
- Bulk operations
- Calendar views
- Academic calendar features

Run tests with:
```bash
mvn test
```

## Getting Started

1. Clone the repository
2. Configure PostgreSQL database
3. Update `application.properties` with database credentials
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```
5. Access the API at `http://localhost:8080/api`

## Contributing

1. Follow the established architectural patterns
2. Extend BaseEntity for all entities
3. Implement BaseDtoMapper for mappers
4. Extend BaseService for service interfaces
5. Extend BaseServiceImpl for service implementations
6. Extend BaseController for controllers
7. Use record types for DTOs with validation
8. Write comprehensive unit tests
9. Follow SOLID, DRY, KISS, and YAGNI principles

## License

This project is licensed under the MIT License. 