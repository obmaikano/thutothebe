#!/bin/bash

# Staff Data Generation Script
# This script generates staff data including ministry, regional, and school staff

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

# Get all schools and regions
echo "Getting schools and regions..."
schools_response=$(make_api_call "GET" "/schools" "" "$TOKEN")
if [ $? -ne 0 ]; then
    echo "Error: Failed to get schools"
    exit 1
fi

regions_response=$(make_api_call "GET" "/regions" "" "$TOKEN")
if [ $? -ne 0 ]; then
    echo "Error: Failed to get regions"
    exit 1
fi

school_ids=($(echo "$schools_response" | jq -r '.data[].id'))
region_ids=($(echo "$regions_response" | jq -r '.data[].id'))

# Create Ministry Staff
echo "Creating ministry staff..."
for i in {1..20}; do
    username="ministry_staff_$i"
    email="${username}@ministry.edu.bw"
    password="Password123!"
    
    # Create user account
    user_data="{
        \"username\": \"$username\",
        \"email\": \"$email\",
        \"password\": \"$password\",
        \"firstName\": \"$(get_random_name)\",
        \"lastName\": \"$(get_random_name)\",
        \"role\": \"MINISTRY_STAFF\",
        \"status\": \"ACTIVE\",
        \"metadata\": {
            \"department\": \"$(get_random_department)\",
            \"position\": \"$(get_random_position)\",
            \"employeeId\": \"MIN$(printf "%04d" $i)\",
            \"accessScope\": \"GLOBAL\",
            \"implementationStatus\": \"COMPLETED\"
        }
    }"
    
    response=$(make_api_call "POST" "/users" "$user_data" "$TOKEN")
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create ministry staff user $i"
        exit 1
    fi
    
    user_id=$(echo "$response" | jq -r '.data.id')
    
    # Create staff profile
    staff_data="{
        \"userId\": \"$user_id\",
        \"department\": \"$(get_random_department)\",
        \"position\": \"$(get_random_position)\",
        \"employeeId\": \"MIN$(printf "%04d" $i)\",
        \"status\": \"ACTIVE\",
        \"metadata\": {
            \"qualifications\": [\"$(get_random_qualification)\", \"$(get_random_qualification)\"],
            \"specializations\": [\"$(get_random_specialization)\", \"$(get_random_specialization)\"],
            \"nationality\": \"CITIZEN\",
            \"accessScope\": \"GLOBAL\",
            \"implementationStatus\": \"COMPLETED\"
        }
    }"
    
    response=$(make_api_call "POST" "/staff" "$staff_data" "$TOKEN")
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create ministry staff profile $i"
        exit 1
    fi
done

# Create Regional Staff
echo "Creating regional staff..."
for region_id in "${region_ids[@]}"; do
    num_staff=$((3 + RANDOM % 3))
    for ((i=1; i<=num_staff; i++)); do
        username="regional_staff_${region_id}_$i"
        email="${username}@region.edu.bw"
        password="Password123!"
        
        # Create user account
        user_data="{
            \"username\": \"$username\",
            \"email\": \"$email\",
            \"password\": \"$password\",
            \"firstName\": \"$(get_random_name)\",
            \"lastName\": \"$(get_random_name)\",
            \"role\": \"REGIONAL_ADMIN\",
            \"status\": \"ACTIVE\",
            \"metadata\": {
                \"regionId\": \"$region_id\",
                \"department\": \"$(get_random_department)\",
                \"position\": \"$(get_random_position)\",
                \"employeeId\": \"REG${region_id}$(printf "%03d" $i)\",
                \"accessScope\": \"REGION\",
                \"implementationStatus\": \"COMPLETED\"
            }
        }"
        
        response=$(make_api_call "POST" "/users" "$user_data" "$TOKEN")
        if [ $? -ne 0 ]; then
            echo "Error: Failed to create regional staff user $i"
            exit 1
        fi
        
        user_id=$(echo "$response" | jq -r '.data.id')
        
        # Create staff profile
        staff_data="{
            \"userId\": \"$user_id\",
            \"regionId\": \"$region_id\",
            \"department\": \"$(get_random_department)\",
            \"position\": \"$(get_random_position)\",
            \"employeeId\": \"REG${region_id}$(printf "%03d" $i)\",
            \"status\": \"ACTIVE\",
            \"metadata\": {
                \"qualifications\": [\"$(get_random_qualification)\", \"$(get_random_qualification)\"],
                \"specializations\": [\"$(get_random_specialization)\", \"$(get_random_specialization)\"],
                \"nationality\": \"CITIZEN\",
                \"accessScope\": \"REGION\",
                \"implementationStatus\": \"COMPLETED\"
            }
        }"
        
        response=$(make_api_call "POST" "/staff" "$staff_data" "$TOKEN")
        if [ $? -ne 0 ]; then
            echo "Error: Failed to create regional staff profile $i"
            exit 1
        fi
    done
done

# Create School Staff
echo "Creating school staff..."
for school_id in "${school_ids[@]}"; do
    # Create School Administrator
    username="school_admin_${school_id}"
    email="${username}@school.edu.bw"
    password="Password123!"
    
    # Create user account
    user_data="{
        \"username\": \"$username\",
        \"email\": \"$email\",
        \"password\": \"$password\",
        \"firstName\": \"$(get_random_name)\",
        \"lastName\": \"$(get_random_name)\",
        \"role\": \"SCHOOL_ADMIN\",
        \"status\": \"ACTIVE\",
        \"metadata\": {
            \"schoolId\": \"$school_id\",
            \"department\": \"Administration\",
            \"position\": \"School Administrator\",
            \"employeeId\": \"SCH${school_id}001\",
            \"accessScope\": \"SCHOOL\",
            \"implementationStatus\": \"COMPLETED\"
        }
    }"
    
    response=$(make_api_call "POST" "/users" "$user_data" "$TOKEN")
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create school admin user for school $school_id"
        exit 1
    fi
    
    user_id=$(echo "$response" | jq -r '.data.id')
    
    # Create staff profile
    staff_data="{
        \"userId\": \"$user_id\",
        \"schoolId\": \"$school_id\",
        \"department\": \"Administration\",
        \"position\": \"School Administrator\",
        \"employeeId\": \"SCH${school_id}001\",
        \"status\": \"ACTIVE\",
        \"metadata\": {
            \"qualifications\": [\"$(get_random_qualification)\", \"$(get_random_qualification)\"],
            \"specializations\": [\"School Administration\", \"Education Management\"],
            \"nationality\": \"CITIZEN\",
            \"accessScope\": \"SCHOOL\",
            \"implementationStatus\": \"COMPLETED\"
        }
    }"
    
    response=$(make_api_call "POST" "/staff" "$staff_data" "$TOKEN")
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create school admin profile for school $school_id"
        exit 1
    fi
    
    # Create Teachers
    num_teachers=$((10 + RANDOM % 11))
    for ((i=1; i<=num_teachers; i++)); do
        username="teacher_${school_id}_$i"
        email="${username}@school.edu.bw"
        password="Password123!"
        
        # Create user account
        user_data="{
            \"username\": \"$username\",
            \"email\": \"$email\",
            \"password\": \"$password\",
            \"firstName\": \"$(get_random_name)\",
            \"lastName\": \"$(get_random_name)\",
            \"role\": \"TEACHER\",
            \"status\": \"ACTIVE\",
            \"metadata\": {
                \"schoolId\": \"$school_id\",
                \"department\": \"$(get_random_department)\",
                \"position\": \"Teacher\",
                \"employeeId\": \"SCH${school_id}$(printf "%03d" $((i+1)))\",
                \"accessScope\": \"SCHOOL\",
                \"implementationStatus\": \"COMPLETED\"
            }
        }"
        
        response=$(make_api_call "POST" "/users" "$user_data" "$TOKEN")
        if [ $? -ne 0 ]; then
            echo "Error: Failed to create teacher user $i for school $school_id"
            exit 1
        fi
        
        user_id=$(echo "$response" | jq -r '.data.id')
        
        # Create staff profile
        staff_data="{
            \"userId\": \"$user_id\",
            \"schoolId\": \"$school_id\",
            \"department\": \"$(get_random_department)\",
            \"position\": \"Teacher\",
            \"employeeId\": \"SCH${school_id}$(printf "%03d" $((i+1)))\",
            \"status\": \"ACTIVE\",
            \"metadata\": {
                \"qualifications\": [\"$(get_random_qualification)\", \"$(get_random_qualification)\"],
                \"specializations\": [\"$(get_random_specialization)\", \"$(get_random_specialization)\"],
                \"nationality\": \"CITIZEN\",
                \"accessScope\": \"SCHOOL\",
                \"implementationStatus\": \"COMPLETED\"
            }
        }"
        
        response=$(make_api_call "POST" "/staff" "$staff_data" "$TOKEN")
        if [ $? -ne 0 ]; then
            echo "Error: Failed to create teacher profile $i for school $school_id"
            exit 1
        fi
    done
done

echo "Staff data generation completed successfully!" 