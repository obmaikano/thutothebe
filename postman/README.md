# Thuto Thebe Data Generation Collections

This directory contains Postman collections for generating realistic test data for the Thuto Thebe application.

## Collections Overview

1. **01-base-setup.json**
   - Creates 10 regions
   - Creates 250 schools distributed across regions
   - Sets up the basic structure for the application

2. **02-student-data.json**
   - Creates 3,000 students with realistic data
   - Generates academic records for 3 years
   - Distributes students across schools and classes

## Prerequisites

1. Install [Postman](https://www.postman.com/downloads/)
2. Import the collections into Postman
3. Set up the following environment variables in Postman:
   - `baseUrl`: Your application's base URL (e.g., `http://localhost:8080`)

## Data Generation Scripts

The `scripts/data-generator.js` file contains utility functions for generating realistic data. These functions are used in the Postman collections to create:

- Region codes and names
- School codes and names
- Student admission numbers
- Personal information (names, DOB, contact details)
- Academic records (marks, grades, remarks)

## Usage Instructions

1. **Base Setup**
   - Run the "Create Regions" request 10 times to create all regions
   - Run the "Create Schools" request 250 times to create all schools
   - The schools will be automatically distributed across regions

2. **Student Data**
   - Run the "Create Student" request 3,000 times to create all students
   - Run the "Create Student Performance" request for each student to generate academic records
   - The students will be automatically distributed across schools

## Data Distribution

- **Regions**: 10 regions with unique codes and names
- **Schools**: 250 schools distributed across regions (approximately 25 schools per region)
- **Students**: 3,000 students distributed across schools (approximately 12 students per school)
- **Academic Records**: 3 years of data (2021-2023) for each student

## Notes

- All generated data is realistic and follows the application's data model
- The data generation scripts ensure proper relationships between entities
- Academic records are generated with realistic grade distributions
- Contact information follows local formats (e.g., phone numbers, addresses)

## Troubleshooting

If you encounter any issues:

1. Check that the `baseUrl` environment variable is set correctly
2. Ensure all required API endpoints are accessible
3. Verify that the database is properly configured
4. Check the Postman console for any error messages 