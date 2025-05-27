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