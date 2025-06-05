#!/bin/bash

# Student Data Generation Script
# This script generates student data including students and their parents/guardians

# Load environment variables
if [ ! -f .env ]; then
    echo "Error: .env file not found"
    exit 1
fi
source .env

# Load functions
if [ ! -f scripts/functions.sh ]; then
    echo "Error: functions.sh not found"
    exit 1
fi
source scripts/functions.sh

# Validate environment variables
if ! validate_env_vars; then
    exit 1
fi

# Check if API is available
if ! check_api_availability; then
    exit 1
fi

# Get authentication token
TOKEN=$(get_auth_token "$ADMIN_EMAIL" "$ADMIN_PASSWORD")
if [ -z "$TOKEN" ]; then
    echo "Error: Failed to get authentication token"
    exit 1
fi

# Function to make API calls
make_api_call() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4

    local response
    if [ -n "$data" ]; then
        response=$(curl -s -X "$method" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d "$data" \
            "${API_BASE_URL}${endpoint}")
    else
        response=$(curl -s -X "$method" \
            -H "Authorization: Bearer $token" \
            "${API_BASE_URL}${endpoint}")
    fi

    if [ $? -ne 0 ]; then
        echo "Error: API call failed"
        return 1
    fi

    echo "$response"
}

# Get all schools, classes, and subjects
echo "Getting schools, classes, and subjects..."
schools_response=$(make_api_call "GET" "/schools" "" "$TOKEN")
if [ $? -ne 0 ]; then
    echo "Error: Failed to get schools"
    exit 1
fi

classes_response=$(make_api_call "GET" "/classes" "" "$TOKEN")
if [ $? -ne 0 ]; then
    echo "Error: Failed to get classes"
    exit 1
fi

subjects_response=$(make_api_call "GET" "/subjects" "" "$TOKEN")
if [ $? -ne 0 ]; then
    echo "Error: Failed to get subjects"
    exit 1
fi

# Create Parents/Guardians
echo "Creating parents/guardians..."
for i in {1..20}; do
    # Generate random data for parent
    parent_first_name=$(get_random_first_name)
    parent_last_name=$(get_random_last_name)
    parent_email=$(get_random_email "$parent_first_name" "$parent_last_name")
    parent_password="Password123!"
    parent_nationality=$(get_random_nationality)
    parent_dob=$(get_random_date 1960 1990)
    parent_gender=$(get_random_gender)
    parent_id=$(get_random_identity_number)
    parent_qualification=$(get_random_qualification)
    parent_phone=$(get_random_phone)

    # Create parent/guardian
    echo "Creating parent/guardian $i..."
    parent_data="{
        \"email\": \"$parent_email\",
        \"password\": \"$parent_password\",
        \"firstName\": \"$parent_first_name\",
        \"lastName\": \"$parent_last_name\",
        \"surname\": \"$parent_last_name\",
        \"nationality\": \"$parent_nationality\",
        \"dateOfBirth\": \"$parent_dob\",
        \"gender\": \"$parent_gender\",
        \"identityNumber\": \"$parent_id\",
        \"qualification\": \"$parent_qualification\",
        \"role\": \"PARENT\"
    }"

    response=$(make_api_call "POST" "/parents" "$parent_data" "$TOKEN")
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create parent/guardian"
        exit 1
    fi

    if ! handle_api_error "$response" "parent creation"; then
        exit 1
    fi

    # Extract parent ID from response
    parent_id=$(echo "$response" | jq -r '.data.id')
    if [ -z "$parent_id" ] || [ "$parent_id" = "null" ]; then
        echo "Error: Failed to extract parent ID from response"
        echo "Response: $response"
        exit 1
    fi

    # Create parent profile with additional information
    parent_profile_data="{
        \"userId\": \"$parent_id\",
        \"occupation\": \"$(get_random_occupation)\",
        \"company\": \"$(get_random_company)\",
        \"phoneNumber\": \"$parent_phone\",
        \"status\": \"ACTIVE\",
        \"metadata\": {
            \"address\": \"$(get_random_address)\",
            \"emergencyContact\": \"$(get_random_phone)\",
            \"preferredLanguage\": \"English\",
            \"communicationPreferences\": [\"Email\", \"SMS\"]
        }
    }"

    profile_response=$(make_api_call "POST" "/parent-profiles" "$parent_profile_data" "$TOKEN")
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create parent profile"
        exit 1
    fi

    if ! handle_api_error "$profile_response" "parent profile creation"; then
        exit 1
    fi

    echo "Parent/guardian $i created successfully"
done

echo "Parent/guardian creation completed successfully."

# Get created parents
parents_response=$(make_api_call "GET" "/parents" "" "$TOKEN")
if [ $? -ne 0 ]; then
    echo "Error: Failed to get parents"
    exit 1
fi

parent_ids=($(echo "$parents_response" | jq -r '.data[].id'))

# Create Students
echo "Creating students..."
school_ids=($(echo "$schools_response" | jq -r '.data[].id'))
for school_id in "${school_ids[@]}"; do
    num_students=$((50 + RANDOM % 51))
    for ((i=1; i<=num_students; i++)); do
        # Get random class for this student
        class_id=$(echo "$classes_response" | jq -r ".data[] | select(.schoolId == \"$school_id\") | .id" | shuf -n 1)
        if [ -z "$class_id" ]; then
            echo "Error: No class found for school $school_id"
            continue
        fi
        
        # Get random parent for this student
        parent_id=${parent_ids[$RANDOM % ${#parent_ids[@]}]}
        
        username="student_${school_id}_$i"
        email="${username}@school.edu.bw"
        password="Password123!"
        
        # Create user account
        user_data="{
            \"username\": \"$username\",
            \"email\": \"$email\",
            \"password\": \"$password\",
            \"firstName\": \"$(get_random_name)\",
            \"lastName\": \"$(get_random_name)\",
            \"role\": \"STUDENT\",
            \"status\": \"ACTIVE\",
            \"metadata\": {
                \"schoolId\": \"$school_id\",
                \"classId\": \"$class_id\",
                \"admissionNumber\": \"STU$(get_random_number 1000 9999)\",
                \"accessScope\": \"CLASS\",
                \"implementationStatus\": \"COMPLETED\"
            }
        }"
        
        response=$(make_api_call "POST" "/users" "$user_data" "$TOKEN")
        if [ $? -ne 0 ]; then
            echo "Error: Failed to create student user $i"
            exit 1
        fi
        
        user_id=$(echo "$response" | jq -r '.data.id')
        
        # Create student profile
        student_data="{
            \"userId\": \"$user_id\",
            \"schoolId\": \"$school_id\",
            \"classId\": \"$class_id\",
            \"parentId\": \"$parent_id\",
            \"admissionNumber\": \"STU$(get_random_number 1000 9999)\",
            \"dateOfBirth\": \"$(get_random_student_dob)\",
            \"gender\": \"$(get_random_gender)\",
            \"status\": \"ACTIVE\",
            \"metadata\": {
                \"address\": \"$(get_random_address)\",
                \"phone\": \"+267 $(get_random_phone)\",
                \"emergencyContact\": \"+267 $(get_random_phone)\",
                \"medicalConditions\": [\"$(get_random_medical_condition)\"],
                \"disabilities\": [\"$(get_random_disability)\"],
                \"previousSchool\": \"$(get_random_school)\",
                \"previousGrades\": \"$(get_random_grade_letter)\",
                \"specialNeeds\": \"$(get_random_special_needs)\",
                \"languageProficiency\": \"$(get_random_language_proficiency)\",
                \"extracurricularActivities\": [\"$(get_random_activity)\", \"$(get_random_activity)\"],
                \"nationality\": \"CITIZEN\",
                \"accessScope\": \"CLASS\",
                \"implementationStatus\": \"COMPLETED\"
            }
        }"
        
        response=$(make_api_call "POST" "/students" "$student_data" "$TOKEN")
        if [ $? -ne 0 ]; then
            echo "Error: Failed to create student profile $i"
            exit 1
        fi
        
        student_id=$(echo "$response" | jq -r '.data.id')
        
        # Create student performance records
        subject_ids=($(echo "$subjects_response" | jq -r '.data[].id'))
        for subject_id in "${subject_ids[@]}"; do
            for year in 2022 2023 2024; do
                performance_data="{
                    \"studentId\": \"$student_id\",
                    \"subjectId\": \"$subject_id\",
                    \"academicYear\": \"$year\",
                    \"term\": \"$(get_random_term)\",
                    \"marks\": $(get_random_marks),
                    \"grade\": \"$(get_random_grade_letter)\",
                    \"status\": \"ACTIVE\",
                    \"metadata\": {
                        \"assessmentType\": \"$(get_random_assessment_type)\",
                        \"teacherComments\": \"$(get_random_comments)\",
                        \"improvementAreas\": [\"$(get_random_improvement_area)\"],
                        \"strengths\": [\"$(get_random_strength)\"],
                        \"implementationStatus\": \"COMPLETED\"
                    }
                }"
                
                response=$(make_api_call "POST" "/student-performance" "$performance_data" "$TOKEN")
                if [ $? -ne 0 ]; then
                    echo "Error: Failed to create performance record for student $student_id"
                    exit 1
                fi
            done
        done
        
        # Create student attendance records
        for year in 2022 2023 2024; do
            for month in {1..12}; do
                attendance_data="{
                    \"studentId\": \"$student_id\",
                    \"date\": \"$year-$month-01\",
                    \"status\": \"$(get_random_attendance_status)\",
                    \"status\": \"ACTIVE\",
                    \"metadata\": {
                        \"reason\": \"$(get_random_absence_reason)\",
                        \"verifiedBy\": \"$(get_random_teacher_id)\",
                        \"notes\": \"$(get_random_attendance_notes)\",
                        \"implementationStatus\": \"COMPLETED\"
                    }
                }"
                
                response=$(make_api_call "POST" "/attendance" "$attendance_data" "$TOKEN")
                if [ $? -ne 0 ]; then
                    echo "Error: Failed to create attendance record for student $student_id"
                    exit 1
                fi
            done
        done
    done
done

echo "Student data generation completed successfully!" 