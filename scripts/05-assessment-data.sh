#!/bin/bash

# Assessment Data Generation Script
# This script generates assessment data including assignments, tests, and grades

# Load environment variables
if [ -f .env ]; then
    source .env
else
    echo "Error: .env file not found"
    exit 1
fi

# Load helper functions
if [ -f scripts/functions.sh ]; then
    source scripts/functions.sh
else
    echo "Error: functions.sh not found"
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

# Authenticate and get token
AUTH_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"'$ADMIN_EMAIL'","password":"'$ADMIN_PASSWORD'"}' "$API_BASE_URL/auth/login")
TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d '"' -f4)
if [ -z "$TOKEN" ]; then
    echo "Failed to authenticate. Response: $AUTH_RESPONSE"
    exit 1
fi

# Get all schools, classes, subjects, and students
echo "Getting schools, classes, subjects, and students..."
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

students_response=$(make_api_call "GET" "/students" "" "$TOKEN")
if [ $? -ne 0 ]; then
    echo "Error: Failed to get students"
    exit 1
fi

# Create Assignments
echo "Creating assignments..."
school_ids=($(echo "$schools_response" | jq -r '.data[].id'))
for school_id in "${school_ids[@]}"; do
    class_ids=($(echo "$classes_response" | jq -r ".data[] | select(.schoolId == \"$school_id\") | .id"))
    for class_id in "${class_ids[@]}"; do
        subject_ids=($(echo "$subjects_response" | jq -r '.data[].id'))
        for subject_id in "${subject_ids[@]}"; do
            assignment_data="{
                \"schoolId\": \"$school_id\",
                \"classId\": \"$class_id\",
                \"subjectId\": \"$subject_id\",
                \"title\": \"$(get_random_assignment_title)\",
                \"description\": \"$(get_random_assignment_description)\",
                \"dueDate\": \"$(get_random_future_date)\",
                \"totalMarks\": $(get_random_marks),
                \"status\": \"PUBLISHED\",
                \"metadata\": {
                    \"assignmentType\": \"ASSIGNMENT\",
                    \"difficultyLevel\": \"$(get_random_difficulty_level)\",
                    \"submissionType\": \"$(get_random_submission_type)\",
                    \"accessScope\": \"CLASS\",
                    \"implementationStatus\": \"COMPLETED\",
                    \"submissionPhase\": \"SUBMISSION\"
                }
            }"
            
            response=$(make_api_call "POST" "/assignments" "$assignment_data" "$TOKEN")
            if [ $? -ne 0 ]; then
                echo "Error: Failed to create assignment for school $school_id, class $class_id, subject $subject_id"
                exit 1
            fi
            
            assignment_id=$(echo "$response" | jq -r '.data.id')
            
            # Create Submissions
            student_ids=($(echo "$students_response" | jq -r ".data[] | select(.classId == \"$class_id\") | .id"))
            for student_id in "${student_ids[@]}"; do
                submission_data="{
                    \"assignmentId\": \"$assignment_id\",
                    \"studentId\": \"$student_id\",
                    \"submissionDate\": \"$(get_random_past_date)\",
                    \"marks\": $(get_random_marks),
                    \"feedback\": \"$(get_random_feedback)\",
                    \"status\": \"SUBMITTED\",
                    \"metadata\": {
                        \"submissionType\": \"$(get_random_submission_type)\",
                        \"lateSubmission\": $(get_random_boolean),
                        \"accessScope\": \"CLASS\",
                        \"implementationStatus\": \"COMPLETED\",
                        \"assessmentStatus\": \"GRADED\"
                    }
                }"
                
                response=$(make_api_call "POST" "/submissions" "$submission_data" "$TOKEN")
                if [ $? -ne 0 ]; then
                    echo "Error: Failed to create submission for assignment $assignment_id, student $student_id"
                    exit 1
                fi
            done
        done
    done
done

# Create Tests
echo "Creating tests..."
for school_id in "${school_ids[@]}"; do
    class_ids=($(echo "$classes_response" | jq -r ".data[] | select(.schoolId == \"$school_id\") | .id"))
    for class_id in "${class_ids[@]}"; do
        subject_ids=($(echo "$subjects_response" | jq -r '.data[].id'))
        for subject_id in "${subject_ids[@]}"; do
            test_data="{
                \"schoolId\": \"$school_id\",
                \"classId\": \"$class_id\",
                \"subjectId\": \"$subject_id\",
                \"title\": \"$(get_random_test_title)\",
                \"description\": \"$(get_random_test_description)\",
                \"testDate\": \"$(get_random_future_date)\",
                \"duration\": $(get_random_duration),
                \"totalMarks\": $(get_random_marks),
                \"status\": \"PUBLISHED\",
                \"metadata\": {
                    \"testType\": \"EXAM\",
                    \"difficultyLevel\": \"$(get_random_difficulty_level)\",
                    \"accessScope\": \"CLASS\",
                    \"implementationStatus\": \"COMPLETED\",
                    \"scheduleType\": \"EXAM\"
                }
            }"
            
            response=$(make_api_call "POST" "/tests" "$test_data" "$TOKEN")
            if [ $? -ne 0 ]; then
                echo "Error: Failed to create test for school $school_id, class $class_id, subject $subject_id"
                exit 1
            fi
            
            test_id=$(echo "$response" | jq -r '.data.id')
            
            # Create Test Results
            student_ids=($(echo "$students_response" | jq -r ".data[] | select(.classId == \"$class_id\") | .id"))
            for student_id in "${student_ids[@]}"; do
                result_data="{
                    \"testId\": \"$test_id\",
                    \"studentId\": \"$student_id\",
                    \"marks\": $(get_random_marks),
                    \"grade\": \"$(get_random_grade_letter)\",
                    \"feedback\": \"$(get_random_feedback)\",
                    \"status\": \"GRADED\",
                    \"metadata\": {
                        \"attemptNumber\": 1,
                        \"timeTaken\": $(get_random_duration),
                        \"accessScope\": \"CLASS\",
                        \"implementationStatus\": \"COMPLETED\",
                        \"assessmentStatus\": \"GRADED\"
                    }
                }"
                
                response=$(make_api_call "POST" "/test-results" "$result_data" "$TOKEN")
                if [ $? -ne 0 ]; then
                    echo "Error: Failed to create test result for test $test_id, student $student_id"
                    exit 1
                fi
            done
        done
    done
done

# Create Grade Categories
echo "Creating grade categories..."
for school_id in "${school_ids[@]}"; do
    category_data="{
        \"schoolId\": \"$school_id\",
        \"name\": \"$(get_random_grade_category)\",
        \"description\": \"$(get_random_grade_category_description)\",
        \"weight\": $(get_random_weight),
        \"status\": \"ACTIVE\",
        \"metadata\": {
            \"categoryType\": \"ASSESSMENT\",
            \"accessScope\": \"SCHOOL\",
            \"implementationStatus\": \"COMPLETED\"
        }
    }"
    
    response=$(make_api_call "POST" "/grade-categories" "$category_data" "$TOKEN")
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create grade category for school $school_id"
        exit 1
    fi
done

# Create Grades
echo "Creating grades..."
for school_id in "${school_ids[@]}"; do
    class_ids=($(echo "$classes_response" | jq -r ".data[] | select(.schoolId == \"$school_id\") | .id"))
    for class_id in "${class_ids[@]}"; do
        subject_ids=($(echo "$subjects_response" | jq -r '.data[].id'))
        for subject_id in "${subject_ids[@]}"; do
            student_ids=($(echo "$students_response" | jq -r ".data[] | select(.classId == \"$class_id\") | .id"))
            for student_id in "${student_ids[@]}"; do
                grade_data="{
                    \"schoolId\": \"$school_id\",
                    \"classId\": \"$class_id\",
                    \"subjectId\": \"$subject_id\",
                    \"studentId\": \"$student_id\",
                    \"term\": \"FIRST_TERM\",
                    \"academicYear\": \"$(get_random_academic_year)\",
                    \"marks\": $(get_random_marks),
                    \"grade\": \"$(get_random_grade_letter)\",
                    \"status\": \"ACTIVE\",
                    \"metadata\": {
                        \"gradeType\": \"STUDENT_TERM\",
                        \"accessScope\": \"CLASS\",
                        \"implementationStatus\": \"COMPLETED\",
                        \"gradeReportType\": \"STUDENT_TERM\"
                    }
                }"
                
                response=$(make_api_call "POST" "/grades" "$grade_data" "$TOKEN")
                if [ $? -ne 0 ]; then
                    echo "Error: Failed to create grade for school $school_id, class $class_id, subject $subject_id, student $student_id"
                    exit 1
                fi
            done
        done
    done
done

echo "Assessment data generation completed successfully!" 