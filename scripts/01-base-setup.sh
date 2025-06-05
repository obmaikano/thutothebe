#!/bin/bash

# Base Setup Script
# This script sets up the base data including regions, schools, subjects, academic years, grade levels, and classes

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

# Create Regions
echo "Creating regions..."
for i in {1..10}; do
    region_name="Region $i"
    region_code="REG$(printf "%03d" $i)"
    region_description="Region $i description"
    region_data="{
        \"name\": \"$region_name\",
        \"code\": \"$region_code\",
        \"description\": \"$region_description\"
    }"
    
    response=$(make_api_call "POST" "/regions" "$region_data" "$TOKEN")
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create region $i"
        exit 1
    fi
done

# Get created regions
regions_response=$(make_api_call "GET" "/regions" "" "$TOKEN")
if [ $? -ne 0 ]; then
    echo "Error: Failed to get regions"
    exit 1
fi

region_ids=($(echo "$regions_response" | jq -r '.data[].id'))

# Create Schools
echo "Creating schools..."
for region_id in "${region_ids[@]}"; do
    num_schools=$((5 + RANDOM % 6))
    for ((i=1; i<=num_schools; i++)); do
        school_data="{
            \"name\": \"School $(get_random_school_name)\",
            \"code\": \"SCH$(printf "%03d" $i)\",
            \"regionId\": \"$region_id\",
            \"status\": \"ACTIVE\",
            \"metadata\": {
                \"principalName\": \"$(get_random_name)\",
                \"establishedYear\": $(get_random_number 1960 2020),
                \"facilities\": [\"Classrooms\", \"Library\", \"Computer Lab\", \"Sports Field\"],
                \"accessScope\": \"SCHOOL\",
                \"implementationStatus\": \"COMPLETED\",
                \"address\": \"$(get_random_address)\",
                \"phone\": \"+267 $(get_random_phone)\",
                \"email\": \"school$i@edu.bw\"
            }
        }"
        
        response=$(make_api_call "POST" "/schools" "$school_data" "$TOKEN")
        if [ $? -ne 0 ]; then
            echo "Error: Failed to create school $i"
            exit 1
        fi
    done
done

# Create Subjects
echo "Creating subjects..."
subjects=(
    "Mathematics"
    "English"
    "Setswana"
    "Science"
    "Social Studies"
    "Agriculture"
    "Art"
    "Music"
    "Physical Education"
    "Computer Studies"
    "Religious Education"
    "Design and Technology"
    "Business Studies"
    "Home Economics"
    "French"
)

for subject in "${subjects[@]}"; do
    subject_data="{
        \"name\": \"$subject\",
        \"code\": \"SUB$(echo $subject | tr -d ' ' | cut -c1-3 | tr '[:lower:]' '[:upper:]')\",
        \"description\": \"$subject subject description\",
        \"status\": \"ACTIVE\",
        \"metadata\": {
            \"prerequisites\": [],
            \"difficultyLevel\": \"$(get_random_difficulty_level)\",
            \"curriculumType\": \"NATIONAL\",
            \"accessScope\": \"SUBJECT\",
            \"implementationStatus\": \"COMPLETED\"
        }
    }"
    
    response=$(make_api_call "POST" "/subjects" "$subject_data" "$TOKEN")
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create subject $subject"
        exit 1
    fi
done

# Create Academic Years
echo "Creating academic years..."
for year in {2022..2024}; do
    academic_year_data="{
        \"year\": $year,
        \"status\": \"ACTIVE\",
        \"metadata\": {
            \"termDates\": {
                \"FIRST_TERM\": {
                    \"startDate\": \"$year-01-15\",
                    \"endDate\": \"$year-04-15\"
                },
                \"SECOND_TERM\": {
                    \"startDate\": \"$year-05-01\",
                    \"endDate\": \"$year-08-15\"
                },
                \"THIRD_TERM\": {
                    \"startDate\": \"$year-09-01\",
                    \"endDate\": \"$year-12-15\"
                }
            },
            \"implementationStatus\": \"COMPLETED\"
        }
    }"
    
    response=$(make_api_call "POST" "/academic-years" "$academic_year_data" "$TOKEN")
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create academic year $year"
        exit 1
    fi
done

# Create Grade Levels
echo "Creating grade levels..."
grade_levels=(
    "STANDARD_1"
    "STANDARD_2"
    "STANDARD_3"
    "STANDARD_4"
    "STANDARD_5"
    "STANDARD_6"
    "STANDARD_7"
    "FORM_1"
    "FORM_2"
    "FORM_3"
    "FORM_4"
    "FORM_5"
)

for grade_level in "${grade_levels[@]}"; do
    grade_level_data="{
        \"name\": \"$grade_level\",
        \"code\": \"$(echo $grade_level | tr -d '_')\",
        \"status\": \"ACTIVE\",
        \"metadata\": {
            \"ageRange\": {
                \"min\": $(get_random_number 5 15),
                \"max\": $(get_random_number 16 20)
            },
            \"requiredSubjects\": [],
            \"implementationStatus\": \"COMPLETED\"
        }
    }"
    
    response=$(make_api_call "POST" "/grade-levels" "$grade_level_data" "$TOKEN")
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create grade level $grade_level"
        exit 1
    fi
done

# Get created schools and grade levels
schools_response=$(make_api_call "GET" "/schools" "" "$TOKEN")
if [ $? -ne 0 ]; then
    echo "Error: Failed to get schools"
    exit 1
fi

grade_levels_response=$(make_api_call "GET" "/grade-levels" "" "$TOKEN")
if [ $? -ne 0 ]; then
    echo "Error: Failed to get grade levels"
    exit 1
fi

school_ids=($(echo "$schools_response" | jq -r '.data[].id'))
grade_level_ids=($(echo "$grade_levels_response" | jq -r '.data[].id'))

# Create Classes
echo "Creating classes..."
for school_id in "${school_ids[@]}"; do
    for grade_level_id in "${grade_level_ids[@]}"; do
        num_classes=$((1 + RANDOM % 3))
        for ((i=1; i<=num_classes; i++)); do
            class_data="{
                \"name\": \"Class $i\",
                \"schoolId\": \"$school_id\",
                \"gradeLevelId\": \"$grade_level_id\",
                \"status\": \"ACTIVE\",
                \"metadata\": {
                    \"roomNumber\": \"R$(get_random_number 100 999)\",
                    \"section\": \"Section $i\",
                    \"capacity\": $(get_random_number 20 40),
                    \"scheduleType\": \"CLASS\",
                    \"implementationStatus\": \"COMPLETED\"
                }
            }"
            
            response=$(make_api_call "POST" "/classes" "$class_data" "$TOKEN")
            if [ $? -ne 0 ]; then
                echo "Error: Failed to create class $i"
                exit 1
            fi
        done
    done
done

echo "Base setup completed successfully!" 