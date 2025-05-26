# Grade Management Module - ThutoLMS

## Overview

The Grade Management module is a comprehensive grading system for ThutoLMS (Botswana's national learning management platform). It provides structured grade recording, moderation, calculation, and reporting capabilities that follow Botswana's education standards and implement best practices for academic grade management.

## 🚀 Features

### Core Functionality
- ✅ **Grade Recording**: Create and manage grades for assessments, assignments, and categories
- ✅ **Grade Moderation**: Built-in moderation workflow with audit trails
- ✅ **Statistical Analytics**: Calculate averages, passing rates, and performance metrics
- ✅ **Bulk Operations**: Efficient bulk grade creation and management
- ✅ **Category Integration**: Link grades to grade categories for better organization
- ✅ **Audit Trails**: Complete audit logging for all grade operations

### Advanced Features
- ✅ **Grade Calculation Rules**: Botswana education system compliance (40% continuous, 60% final)
- ✅ **Report Generation**: Multiple report types (individual, class, term, annual)
- ✅ **Performance Optimization**: EntityGraph queries to prevent N+1 problems
- ✅ **Soft Delete**: Activation/deactivation instead of hard deletes
- ✅ **Real-time Validation**: Comprehensive input validation and error handling

## 📋 Requirements

- Java 17+
- Spring Boot 3.x
- PostgreSQL 12+
- Maven 3.6+

## 🏗️ Architecture

The module follows a clean layered architecture:

```
┌─────────────────┐
│   Controllers   │ ← REST API Layer (25+ endpoints)
├─────────────────┤
│    Services     │ ← Business Logic Layer (40+ methods)
├─────────────────┤
│   Repositories  │ ← Data Access Layer (Optimized queries)
├─────────────────┤
│    Entities     │ ← Domain Model Layer (JPA entities)
└─────────────────┘
```

### Key Components

| Component | Description | Files |
|-----------|-------------|-------|
| **Entities** | Domain models extending BaseEntity | Grade, GradeCategory, GradeCalculationRule, GradeReport |
| **DTOs** | Data transfer objects with validation | GradeDTO, GradeCategoryDTO, etc. |
| **Services** | Business logic implementation | GradeService, GradeCalculationRuleService, GradeReportService |
| **Controllers** | REST API endpoints | GradeController |
| **Repositories** | Data access with optimizations | GradeRepository, etc. |
| **Mappers** | Entity/DTO conversion | GradeMapper, etc. |

## 🚀 Quick Start

### 1. Basic Grade Creation

```bash
# Create a grade for a category
curl -X POST "http://localhost:8080/api/grades/category" \
  -d "studentId=123&gradeCategoryId=456&score=85.5&gradedById=789&feedback=Good work"
```

### 2. Get Student Grades

```bash
# Get all grades for a student
curl "http://localhost:8080/api/grades/student/123"

# Get student grades in a specific category
curl "http://localhost:8080/api/grades/student/123/category/456"
```

### 3. Calculate Statistics

```bash
# Get student average
curl "http://localhost:8080/api/grades/statistics/average/student/123"

# Get category average
curl "http://localhost:8080/api/grades/statistics/average/category/456"
```

### 4. Moderate a Grade

```bash
# Moderate an existing grade
curl -X POST "http://localhost:8080/api/grades/moderate/123" \
  -d "moderatorId=456&moderationNotes=Adjusted score&newScore=88.0"
```

## 📚 Documentation

### Complete Documentation
- **[📖 Full Implementation Guide](docs/GRADE_MANAGEMENT.md)** - Comprehensive implementation documentation
- **[⚡ Quick Reference](docs/GRADE_MANAGEMENT_QUICK_REFERENCE.md)** - Developer quick reference
- **[🔌 API Specification](docs/GRADE_API_SPECIFICATION.md)** - Detailed API documentation

### Key Sections
1. **Architecture Overview** - System design and component relationships
2. **Entity Relationships** - Database schema and relationships
3. **API Endpoints** - Complete REST API reference (25+ endpoints)
4. **Implementation Details** - Service layer, repositories, and mappers
5. **Usage Examples** - Practical code examples and curl commands
6. **Testing** - Unit and integration test examples
7. **Best Practices** - Performance, security, and maintenance guidelines

## 🔗 API Endpoints Summary

### Core Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/grades/student/{id}` | Get all grades for student |
| GET | `/api/grades/course/{id}` | Get all grades for course |
| GET | `/api/grades/category/{id}` | Get all grades in category |
| POST | `/api/grades/category` | Create grade for category |
| POST | `/api/grades/moderate/{id}` | Moderate a grade |

### Statistics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/grades/statistics/average/student/{id}` | Student average |
| GET | `/api/grades/statistics/average/course/{id}` | Course average |
| GET | `/api/grades/statistics/average/category/{id}` | Category average |

### Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/grades/bulk` | Bulk create grades |
| PUT | `/api/grades/{id}/deactivate` | Deactivate grade |
| GET | `/api/grades/exists/student/{sid}/category/{cid}` | Check existence |

## 🏛️ Entity Relationships

### Core Entities

```
User (Student) ──┐
                 │
                 ├── Grade ──── Course
                 │    │
                 │    ├── GradeCategory
                 │    ├── Assessment
                 │    └── Assignment
                 │
User (Teacher) ──┘
```

### Grade Entity Structure
```java
Grade {
  student: User (required)
  course: Course (required)
  gradeCategory: GradeCategory (optional)
  score: Double (0-100, required)
  gradeType: GradeType (required)
  gradedBy: User (required)
  feedback: String (optional)
  isModerated: boolean
  originalScore: Double (for moderation)
  active: boolean (soft delete)
}
```

## 🧪 Testing

### Unit Tests
- **25+ test methods** covering all service operations
- **Mockito** for dependency mocking
- **Success and error scenarios** tested
- **Edge cases** and validation testing

### Integration Tests
- **End-to-end workflows** tested
- **Database integration** with @Transactional
- **Complete grade lifecycle** testing
- **Performance testing** for bulk operations

### Test Coverage
```bash
# Run tests
mvn test

# Generate coverage report
mvn jacoco:report
```

## 🔧 Configuration

### Database Configuration
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/thutolms
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
```

### Application Properties
```properties
# Grade Management Configuration
grade.validation.score.min=0.0
grade.validation.score.max=100.0
grade.moderation.enabled=true
grade.audit.enabled=true
```

## 🚀 Deployment

### Prerequisites
1. PostgreSQL database with ThutoLMS schema
2. Java 17+ runtime environment
3. Application server (Tomcat, etc.)

### Build and Deploy
```bash
# Build the application
mvn clean package

# Run the application
java -jar target/thutothebe-1.0.0.jar

# Or deploy to application server
cp target/thutothebe-1.0.0.war /path/to/tomcat/webapps/
```

## 🔒 Security

### Authentication & Authorization
- **Role-based access control** for all endpoints
- **Input validation** on all parameters
- **Audit logging** for all grade operations
- **Data privacy** protection for student information

### Validation Rules
- **Score validation**: Must be between 0.0 and 100.0
- **Entity validation**: All referenced entities must exist
- **Permission validation**: Users can only access authorized data
- **Input sanitization**: All text inputs are sanitized

## 📊 Performance

### Optimizations
- **EntityGraph queries** prevent N+1 problems
- **Bulk operations** for multiple grade creation
- **Paginated queries** for large result sets
- **Database indexing** on frequently queried fields

### Monitoring
- **Response time metrics** for all endpoints
- **Database query performance** monitoring
- **Error rate tracking** and alerting
- **Resource usage** monitoring

## 🤝 Contributing

### Development Guidelines
1. Follow **SOLID principles** and **clean code** practices
2. Maintain **architectural consistency** with existing patterns
3. Write **comprehensive tests** for all new features
4. Update **documentation** for any changes
5. Follow **code review** process

### Code Standards
- **Java 17** features and best practices
- **Spring Boot 3** conventions
- **JPA/Hibernate** best practices
- **RESTful API** design principles

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Complete Grade Management implementation
- ✅ Grade-GradeCategory relationship integration
- ✅ 25+ REST API endpoints
- ✅ Comprehensive testing suite
- ✅ Performance optimizations
- ✅ Complete documentation

### Upcoming Features
- 🔄 Advanced reporting with charts
- 🔄 Grade import/export functionality
- 🔄 Mobile API optimizations
- 🔄 Real-time notifications

## 🆘 Support

### Documentation
- **[Implementation Guide](docs/GRADE_MANAGEMENT.md)** - Complete technical documentation
- **[Quick Reference](docs/GRADE_MANAGEMENT_QUICK_REFERENCE.md)** - Developer quick start
- **[API Specification](docs/GRADE_API_SPECIFICATION.md)** - REST API reference

### Getting Help
- Check the **documentation** first
- Review **test examples** for usage patterns
- Contact the **development team** for technical support
- Submit **issues** through the project management system

## 📄 License

This module is part of ThutoLMS and follows the same licensing terms as the main project.

---

**ThutoLMS Grade Management Module** - Empowering education in Botswana with comprehensive grade management capabilities. 