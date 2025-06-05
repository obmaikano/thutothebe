// Data generation utilities
const generateRegionCode = () => {
    const regions = ['NR', 'SR', 'ER', 'WR', 'CR', 'NWR', 'NER', 'SWR', 'SER', 'CR'];
    return regions[Math.floor(Math.random() * regions.length)];
};

const generateRegionName = (code) => {
    const regionNames = {
        'NR': 'North Region',
        'SR': 'South Region',
        'ER': 'East Region',
        'WR': 'West Region',
        'CR': 'Central Region',
        'NWR': 'North West Region',
        'NER': 'North East Region',
        'SWR': 'South West Region',
        'SER': 'South East Region'
    };
    return regionNames[code] || 'Unknown Region';
};

const generateSchoolCode = (regionCode) => {
    const schoolTypes = ['PS', 'JS', 'SS'];
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${regionCode}${schoolTypes[Math.floor(Math.random() * schoolTypes.length)]}${randomNum}`;
};

const generateSchoolName = (code) => {
    const prefixes = ['St.', 'St. Mary\'s', 'St. John\'s', 'St. Paul\'s', 'St. Peter\'s', 'St. James\'', 'St. Luke\'s'];
    const types = ['Primary School', 'Junior Secondary', 'Senior Secondary', 'High School'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    return `${randomPrefix} ${randomType}`;
};

const generateAdmissionNumber = (schoolCode, year) => {
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${schoolCode}${year}${randomNum}`;
};

const generateName = (isFirstName = true) => {
    const firstNames = ['John', 'Mary', 'James', 'Sarah', 'Michael', 'Elizabeth', 'David', 'Emma', 'Robert', 'Sophia'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    return isFirstName ? firstNames[Math.floor(Math.random() * firstNames.length)] : lastNames[Math.floor(Math.random() * lastNames.length)];
};

const generateDateOfBirth = () => {
    const start = new Date(2000, 0, 1);
    const end = new Date(2015, 11, 31);
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
};

const generatePhone = () => {
    return `+267${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
};

const generateEmail = (firstName, lastName) => {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const randomNum = Math.floor(Math.random() * 1000);
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domains[Math.floor(Math.random() * domains.length)]}`;
};

const generateAddress = () => {
    const streets = ['Main Street', 'Church Road', 'School Lane', 'Park Avenue', 'Market Street'];
    const cities = ['Gaborone', 'Francistown', 'Maun', 'Serowe', 'Kanye'];
    const streetNum = Math.floor(Math.random() * 100) + 1;
    return `${streetNum} ${streets[Math.floor(Math.random() * streets.length)]}, ${cities[Math.floor(Math.random() * cities.length)]}`;
};

const generateAcademicYear = () => {
    return Math.floor(Math.random() * 3) + 2021; // 2021-2023
};

const generateMarks = () => {
    return Math.floor(Math.random() * 41) + 60; // 60-100
};

const generateGrade = (marks) => {
    if (marks >= 90) return 'A';
    if (marks >= 80) return 'B';
    if (marks >= 70) return 'C';
    if (marks >= 60) return 'D';
    return 'F';
};

const generateRemarks = (grade) => {
    const remarks = {
        'A': ['Excellent work!', 'Outstanding performance!', 'Keep up the good work!'],
        'B': ['Good work!', 'Well done!', 'Solid performance!'],
        'C': ['Satisfactory work', 'Average performance', 'Room for improvement'],
        'D': ['Needs improvement', 'Below average', 'Work harder'],
        'F': ['Failed', 'Needs significant improvement', 'Must retake']
    };
    return remarks[grade][Math.floor(Math.random() * remarks[grade].length)];
};

// Export functions for use in Postman
pm.globals.set('generateRegionCode', generateRegionCode);
pm.globals.set('generateRegionName', generateRegionName);
pm.globals.set('generateSchoolCode', generateSchoolCode);
pm.globals.set('generateSchoolName', generateSchoolName);
pm.globals.set('generateAdmissionNumber', generateAdmissionNumber);
pm.globals.set('generateName', generateName);
pm.globals.set('generateDateOfBirth', generateDateOfBirth);
pm.globals.set('generatePhone', generatePhone);
pm.globals.set('generateEmail', generateEmail);
pm.globals.set('generateAddress', generateAddress);
pm.globals.set('generateAcademicYear', generateAcademicYear);
pm.globals.set('generateMarks', generateMarks);
pm.globals.set('generateGrade', generateGrade);
pm.globals.set('generateRemarks', generateRemarks); 