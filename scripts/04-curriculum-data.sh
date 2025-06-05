#!/bin/bash

# Curriculum Data Generation Script
# This script generates curriculum data including subjects, grade levels, and learning objectives

# Load environment variables
if [ ! -f .env ]; then
    echo "Error: .env file not found"
    exit 1
fi
source .env

# Load helper functions
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

# Get all subjects and grade levels
echo "Getting subjects and grade levels..."
subjects_response=$(make_api_call "GET" "/subjects" "" "$TOKEN")
if [ $? -ne 0 ]; then
    echo "Error: Failed to get subjects"
    exit 1
fi

grade_levels_response=$(make_api_call "GET" "/grade-levels" "" "$TOKEN")
if [ $? -ne 0 ]; then
    echo "Error: Failed to get grade levels"
    exit 1
fi

# Create Curriculum
echo "Creating curriculum..."
curriculum_data="{
    \"name\": \"Botswana National Curriculum\",
    \"description\": \"The official curriculum for primary and secondary education in Botswana\",
    \"version\": \"2024\",
    \"status\": \"ACTIVE\",
    \"metadata\": {
        \"implementationYear\": 2024,
        \"reviewDate\": \"2025-12-31\",
        \"curriculumType\": \"NATIONAL\",
        \"accessScope\": \"NATIONAL\",
        \"implementationStatus\": \"COMPLETED\"
    }
}"

response=$(make_api_call "POST" "/curriculum" "$curriculum_data" "$TOKEN")
if [ $? -ne 0 ]; then
    echo "Error: Failed to create curriculum"
    exit 1
fi

curriculum_id=$(echo "$response" | jq -r '.data.id')

# Create Curriculum Subjects
echo "Creating curriculum subjects..."
subject_ids=($(echo "$subjects_response" | jq -r '.data[].id'))
for subject_id in "${subject_ids[@]}"; do
    subject_data="{
        \"curriculumId\": \"$curriculum_id\",
        \"subjectId\": \"$subject_id\",
        \"status\": \"ACTIVE\",
        \"metadata\": {
            \"subjectCode\": \"$(echo "$subjects_response" | jq -r ".data[] | select(.id == \"$subject_id\") | .code")\",
            \"subjectName\": \"$(echo "$subjects_response" | jq -r ".data[] | select(.id == \"$subject_id\") | .name")\",
            \"curriculumType\": \"NATIONAL\",
            \"accessScope\": \"NATIONAL\",
            \"implementationStatus\": \"COMPLETED\"
        }
    }"
    
    response=$(make_api_call "POST" "/curriculum-subjects" "$subject_data" "$TOKEN")
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create curriculum subject for subject $subject_id"
        exit 1
    fi
done

# Create Curriculum Grade Levels
echo "Creating curriculum grade levels..."
for i in {1..12}; do
    grade_data="{
        \"name\": \"Grade $i\",
        \"code\": \"G$i\",
        \"description\": \"Grade $i curriculum\",
        \"order\": $i
    }"

    response=$(make_api_call "POST" "/curriculum/grade-levels" "$grade_data" "$TOKEN")
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create grade level $i"
        exit 1
    fi

    if ! handle_api_error "$response" "grade level creation"; then
        exit 1
    fi

    echo "Grade level $i created successfully"
done

# Get created grade levels
echo "Fetching created grade levels..."
grade_levels_response=$(make_api_call "GET" "/curriculum/grade-levels" "" "$TOKEN")
if [ $? -ne 0 ]; then
    echo "Error: Failed to fetch grade levels"
    exit 1
fi

if ! handle_api_error "$grade_levels_response" "grade levels fetch"; then
    exit 1
fi

# Check if response contains data
if [ -z "$grade_levels_response" ] || [ "$grade_levels_response" = "null" ]; then
    echo "Error: No grade levels found in response"
    echo "Response: $grade_levels_response"
    exit 1
fi

# Create subjects for each grade level
echo "Creating subjects..."
subjects=("Mathematics" "English" "Science" "Social Studies" "Art" "Physical Education")

for grade_level in $(echo "$grade_levels_response" | jq -r '.data[] | @base64'); do
    grade_data=$(echo "$grade_level" | base64 --decode)
    grade_id=$(echo "$grade_data" | jq -r '.id')
    grade_name=$(echo "$grade_data" | jq -r '.name')

    if [ -z "$grade_id" ] || [ "$grade_id" = "null" ]; then
        echo "Error: Invalid grade level data"
        echo "Grade data: $grade_data"
        continue
    fi

    for subject in "${subjects[@]}"; do
        subject_data="{
            \"name\": \"$subject\",
            \"code\": \"${subject:0:3}$grade_id\",
            \"description\": \"$subject for $grade_name\",
            \"gradeLevelId\": \"$grade_id\"
        }"

        response=$(make_api_call "POST" "/curriculum/subjects" "$subject_data" "$TOKEN")
        if [ $? -ne 0 ]; then
            echo "Error: Failed to create subject $subject for $grade_name"
            continue
        fi

        if ! handle_api_error "$response" "subject creation"; then
            continue
        fi

        echo "Subject $subject created for $grade_name"
    done
done

# Create Learning Objectives
echo "Creating learning objectives..."
for subject_id in "${subject_ids[@]}"; do
    for grade_level_id in "${grade_level_ids[@]}"; do
        for term in "TERM1" "TERM2" "TERM3"; do
            objective_data="{
                \"curriculumId\": \"$curriculum_id\",
                \"subjectId\": \"$subject_id\",
                \"gradeLevelId\": \"$grade_level_id\",
                \"term\": \"$term\",
                \"objective\": \"$(get_random_learning_objective)\",
                \"status\": \"ACTIVE\",
                \"metadata\": {
                    \"subjectCode\": \"$(echo "$subjects_response" | jq -r ".data[] | select(.id == \"$subject_id\") | .code")\",
                    \"gradeLevel\": \"$(echo "$grade_levels_response" | jq -r ".data[] | select(.id == \"$grade_level_id\") | .name")\",
                    \"curriculumType\": \"NATIONAL\",
                    \"accessScope\": \"NATIONAL\",
                    \"implementationStatus\": \"COMPLETED\"
                }
            }"
            
            response=$(make_api_call "POST" "/learning-objectives" "$objective_data" "$TOKEN")
            if [ $? -ne 0 ]; then
                echo "Error: Failed to create learning objective for subject $subject_id, grade level $grade_level_id, term $term"
                exit 1
            fi
        done
    done
done

# Create Assessment Criteria
echo "Creating assessment criteria..."
for subject_id in "${subject_ids[@]}"; do
    for grade_level_id in "${grade_level_ids[@]}"; do
        criteria_data="{
            \"curriculumId\": \"$curriculum_id\",
            \"subjectId\": \"$subject_id\",
            \"gradeLevelId\": \"$grade_level_id\",
            \"criteria\": \"$(get_random_assessment_criteria)\",
            \"status\": \"ACTIVE\",
            \"metadata\": {
                \"subjectCode\": \"$(echo "$subjects_response" | jq -r ".data[] | select(.id == \"$subject_id\") | .code")\",
                \"gradeLevel\": \"$(echo "$grade_levels_response" | jq -r ".data[] | select(.id == \"$grade_level_id\") | .name")\",
                \"curriculumType\": \"NATIONAL\",
                \"accessScope\": \"NATIONAL\",
                \"implementationStatus\": \"COMPLETED\"
            }
        }"
        
        response=$(make_api_call "POST" "/assessment-criteria" "$criteria_data" "$TOKEN")
        if [ $? -ne 0 ]; then
            echo "Error: Failed to create assessment criteria for subject $subject_id, grade level $grade_level_id"
            exit 1
        fi
    done
done

echo "Curriculum data generation completed successfully!" 