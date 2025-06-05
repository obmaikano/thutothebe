// Helper function to get random date between start and end dates
function getRandomDate(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to get random item from array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get random number between min and max
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to get random boolean
function getRandomBoolean() {
    return Math.random() < 0.5;
}

// Helper function to get random grade
function getRandomGrade() {
    const grades = ['A', 'B', 'C', 'D', 'E', 'F'];
    return getRandomItem(grades);
}

// Helper function to get random percentage
function getRandomPercentage() {
    return getRandomNumber(0, 100);
}

// Helper function to get random marks
function getRandomMarks(maxMarks) {
    return getRandomNumber(0, maxMarks);
}

// Helper function to get random term
function getRandomTerm() {
    const terms = pm.environment.get('terms').split(',');
    return getRandomItem(terms);
}

// Helper function to get random academic year
function getRandomAcademicYear() {
    const years = pm.environment.get('academicYears').split(',');
    return getRandomItem(years);
}

// Helper function to get random subject
function getRandomSubject() {
    const subjects = pm.environment.get('subjects').split(',');
    return getRandomItem(subjects);
}

// Helper function to get random region
function getRandomRegion() {
    const regions = pm.environment.get('regions').split(',');
    return getRandomItem(regions);
}

// Helper function to get random school type
function getRandomSchoolType() {
    const types = pm.environment.get('schoolTypes').split(',');
    return getRandomItem(types);
}

// Helper function to get random user role
function getRandomUserRole() {
    const roles = pm.environment.get('userRoles').split(',');
    return getRandomItem(roles);
}

// Helper function to get random assessment type
function getRandomAssessmentType() {
    const types = pm.environment.get('assessmentTypes').split(',');
    return getRandomItem(types);
}

// Helper function to get random attendance status
function getRandomAttendanceStatus() {
    const statuses = pm.environment.get('attendanceStatus').split(',');
    return getRandomItem(statuses);
}

// Helper function to get random student status
function getRandomStudentStatus() {
    const statuses = pm.environment.get('studentStatus').split(',');
    return getRandomItem(statuses);
}

// Helper function to get random alert type
function getRandomAlertType() {
    const types = pm.environment.get('alertTypes').split(',');
    return getRandomItem(types);
}

// Helper function to get random alert severity
function getRandomAlertSeverity() {
    const severities = pm.environment.get('alertSeverity').split(',');
    return getRandomItem(severities);
}

// Helper function to get random forum category
function getRandomForumCategory() {
    const categories = pm.environment.get('forumCategories').split(',');
    return getRandomItem(categories);
}

// Helper function to get random announcement type
function getRandomAnnouncementType() {
    const types = pm.environment.get('announcementTypes').split(',');
    return getRandomItem(types);
}

// Helper function to get random announcement priority
function getRandomAnnouncementPriority() {
    const priorities = pm.environment.get('announcementPriority').split(',');
    return getRandomItem(priorities);
}

// Helper function to get random name
function getRandomName() {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Lisa', 'Robert', 'Mary'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    return {
        firstName: getRandomItem(firstNames),
        lastName: getRandomItem(lastNames)
    };
}

// Helper function to get random email
function getRandomEmail(firstName, lastName) {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomItem(domains)}`;
}

// Helper function to get random phone number
function getRandomPhone() {
    return `+267${getRandomNumber(1000000, 9999999)}`;
}

// Helper function to get random address
function getRandomAddress() {
    const streets = ['Main St', 'Broadway', 'Park Ave', 'Market St', 'High St'];
    const cities = ['Gaborone', 'Francistown', 'Maun', 'Serowe', 'Kanye'];
    return {
        street: `${getRandomNumber(1, 999)} ${getRandomItem(streets)}`,
        city: getRandomItem(cities),
        country: 'Botswana'
    };
}

// Helper function to get random date of birth (for students)
function getRandomStudentDOB() {
    const today = new Date();
    const minAge = 12;
    const maxAge = 18;
    const year = today.getFullYear() - getRandomNumber(minAge, maxAge);
    const month = getRandomNumber(1, 12);
    const day = getRandomNumber(1, 28);
    return new Date(year, month - 1, day);
}

// Helper function to get random date of birth (for staff)
function getRandomStaffDOB() {
    const today = new Date();
    const minAge = 25;
    const maxAge = 60;
    const year = today.getFullYear() - getRandomNumber(minAge, maxAge);
    const month = getRandomNumber(1, 12);
    const day = getRandomNumber(1, 28);
    return new Date(year, month - 1, day);
}

// Helper function to get random qualification
function getRandomQualification() {
    const qualifications = [
        'Bachelor of Education',
        'Master of Education',
        'PhD in Education',
        'Diploma in Teaching',
        'Certificate in Education'
    ];
    return getRandomItem(qualifications);
}

// Helper function to get random specialization
function getRandomSpecialization() {
    const specializations = [
        'Mathematics',
        'English',
        'Science',
        'History',
        'Geography',
        'Computer Science',
        'Physical Education',
        'Art',
        'Music'
    ];
    return getRandomItem(specializations);
}

// Helper function to get random years of experience
function getRandomExperience() {
    return getRandomNumber(0, 30);
}

// Helper function to get random class size
function getRandomClassSize() {
    return getRandomNumber(20, 40);
}

// Helper function to get random school size
function getRandomSchoolSize() {
    return getRandomNumber(200, 1000);
}

// Helper function to get random region size
function getRandomRegionSize() {
    return getRandomNumber(5, 20);
}

// Helper function to get random monitoring metrics
function getRandomMonitoringMetrics() {
    return {
        totalActiveTeachers: getRandomNumber(10, 50),
        totalActiveStudents: getRandomNumber(200, 1000),
        totalLogins: getRandomNumber(1000, 5000),
        teacherLogins: getRandomNumber(100, 500),
        studentLogins: getRandomNumber(800, 4000),
        adminLogins: getRandomNumber(50, 200),
        attendanceRate: getRandomPercentage(),
        assignmentSubmissions: getRandomNumber(100, 500),
        assignmentsGraded: getRandomNumber(80, 400),
        averageGradingTurnaroundHours: getRandomNumber(1, 72),
        curriculumCompletionRate: getRandomPercentage(),
        systemUptimePercentage: getRandomNumber(95, 100),
        peakUsageHour: getRandomNumber(8, 16),
        totalAnnouncements: getRandomNumber(5, 20),
        announcementsAcknowledged: getRandomNumber(3, 15),
        forumPosts: getRandomNumber(10, 50)
    };
}

// Helper function to get random alert metrics
function getRandomAlertMetrics() {
    return {
        thresholdValue: getRandomNumber(50, 90),
        actualValue: getRandomNumber(0, 100),
        metricName: getRandomItem(['Attendance', 'Performance', 'System', 'Behavior'])
    };
}

// Export all helper functions
module.exports = {
    getRandomDate,
    getRandomItem,
    getRandomNumber,
    getRandomBoolean,
    getRandomGrade,
    getRandomPercentage,
    getRandomMarks,
    getRandomTerm,
    getRandomAcademicYear,
    getRandomSubject,
    getRandomRegion,
    getRandomSchoolType,
    getRandomUserRole,
    getRandomAssessmentType,
    getRandomAttendanceStatus,
    getRandomStudentStatus,
    getRandomAlertType,
    getRandomAlertSeverity,
    getRandomForumCategory,
    getRandomAnnouncementType,
    getRandomAnnouncementPriority,
    getRandomName,
    getRandomEmail,
    getRandomPhone,
    getRandomAddress,
    getRandomStudentDOB,
    getRandomStaffDOB,
    getRandomQualification,
    getRandomSpecialization,
    getRandomExperience,
    getRandomClassSize,
    getRandomSchoolSize,
    getRandomRegionSize,
    getRandomMonitoringMetrics,
    getRandomAlertMetrics
}; 