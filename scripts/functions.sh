#!/bin/bash

# Helper Functions for Data Generation
# This script contains functions for generating random data

validate_env_vars() {
  if [[ -z "$ADMIN_EMAIL" || -z "$ADMIN_PASSWORD" || -z "$API_BASE_URL" ]]; then
    echo "Missing required environment variables"
    return 1
  fi
  return 0
}


# Function to get random name
get_random_name() {
    local type=$1
    local first_names=("John" "Jane" "Michael" "Sarah" "David" "Emma" "James" "Lisa" "Robert" "Mary")
    local last_names=("Smith" "Johnson" "Williams" "Brown" "Jones" "Garcia" "Miller" "Davis" "Rodriguez" "Martinez")
    
    case $type in
        "first")
            echo "${first_names[$RANDOM % ${#first_names[@]}]}"
            ;;
        "last")
            echo "${last_names[$RANDOM % ${#last_names[@]}]}"
            ;;
        "full")
            echo "${first_names[$RANDOM % ${#first_names[@]}]} ${last_names[$RANDOM % ${#last_names[@]}]}"
            ;;
    esac
}

# Function to get random gender
get_random_gender() {
    local genders=("MALE" "FEMALE" "OTHER")
    echo "${genders[$RANDOM % ${#genders[@]}]}"
}

# Function to get random date of birth for staff
get_random_staff_dob() {
    local year=$((1960 + RANDOM % 30))
    local month=$((1 + RANDOM % 12))
    local day=$((1 + RANDOM % 28))
    printf "%d-%02d-%02d" "$year" "$month" "$day"
}

# Function to get random date of birth for students
get_random_student_dob() {
    local year=$((2006 + RANDOM % 6))
    local month=$((1 + RANDOM % 12))
    local day=$((1 + RANDOM % 28))
    printf "%d-%02d-%02d" "$year" "$month" "$day"
}

# Function to get random qualification
get_random_qualification() {
    local qualifications=(
        "Bachelor of Education"
        "Master of Education"
        "PhD in Education"
        "Diploma in Teaching"
        "Certificate in Education"
    )
    echo "${qualifications[$RANDOM % ${#qualifications[@]}]}"
}

# Function to get random specialization
get_random_specialization() {
    local specializations=(
        "Mathematics"
        "English"
        "Science"
        "History"
        "Geography"
        "Computer Science"
        "Physical Education"
        "Art"
        "Music"
    )
    echo "${specializations[$RANDOM % ${#specializations[@]}]}"
}

# Function to get random experience
get_random_experience() {
    echo $((RANDOM % 30))
}

# Function to get random class size
get_random_class_size() {
    echo $((20 + RANDOM % 21))
}

# Function to get random region size
get_random_region_size() {
    echo $((5 + RANDOM % 16))
}

# Function to get random number between min and max
get_random_number() {
    local min=$1
    local max=$2
    echo $((min + RANDOM % (max - min + 1)))
}

# Function to get random percentage
get_random_percentage() {
    echo $((RANDOM % 101))
}

# Function to get random grade
get_random_grade() {
    local grades=("A" "B" "C" "D" "E" "F")
    echo "${grades[$RANDOM % ${#grades[@]}]}"
}

# Function to get random grade letter
get_random_grade_letter() {
    local letters=("A+" "A" "A-" "B+" "B" "B-" "C+" "C" "C-" "D+" "D" "D-" "F")
    echo "${letters[$RANDOM % ${#letters[@]}]}"
}

# Function to get random rank
get_random_rank() {
    echo $((1 + RANDOM % 40))
}

# Function to get random medical conditions
get_random_medical_conditions() {
    local conditions=("None" "Asthma" "Diabetes" "Allergies" "Epilepsy")
    echo "${conditions[$RANDOM % ${#conditions[@]}]}"
}

# Function to get random disabilities
get_random_disabilities() {
    local disabilities=("None" "Visual" "Hearing" "Physical" "Learning")
    echo "${disabilities[$RANDOM % ${#disabilities[@]}]}"
}

# Function to get random relationship
get_random_relationship() {
    local relationships=("Parent" "Guardian" "Sibling" "Relative")
    echo "${relationships[$RANDOM % ${#relationships[@]}]}"
}

# Function to get random onboarding notes
get_random_onboarding_notes() {
    local notes=(
        "Regular student"
        "Transfer student"
        "New admission"
        "Returning student"
    )
    echo "${notes[$RANDOM % ${#notes[@]}]}"
}

# Function to get random marks
get_random_marks() {
    local max_marks=$1
    echo $((RANDOM % (max_marks + 1)))
}

# Function to get random remarks
get_random_remarks() {
    local remarks=(
        "Good performance"
        "Needs improvement"
        "Excellent work"
        "Satisfactory"
        "Below average"
    )
    echo "${remarks[$RANDOM % ${#remarks[@]}]}"
}

# Function to get random attendance status
get_random_attendance_status() {
    local statuses=("PRESENT" "ABSENT" "LATE" "EXCUSED")
    echo "${statuses[$RANDOM % ${#statuses[@]}]}"
}

# Function to get random attendance remarks
get_random_attendance_remarks() {
    local remarks=(
        "Regular attendance"
        "Late arrival"
        "Excused absence"
        "Unexcused absence"
        "Early departure"
    )
    echo "${remarks[$RANDOM % ${#remarks[@]}]}"
}

# Function to get random teacher ID
get_random_teacher_id() {
    # This should be implemented to get a random teacher ID from the database
    # For now, return a placeholder
    echo "T${RANDOM}${RANDOM}"
}

# Function to get random assessment type
get_random_assessment_type() {
    local types=("QUIZ" "ASSIGNMENT" "PROJECT" "MIDTERM" "FINAL")
    echo "${types[$RANDOM % ${#types[@]}]}"
}

# Function to get random due date
get_random_due_date() {
    local year=$((2022 + RANDOM % 3))
    local month=$((1 + RANDOM % 12))
    local day=$((1 + RANDOM % 28))
    printf "%d-%02d-%02d" "$year" "$month" "$day"
}

# Function to get random color
get_random_color() {
    local colors=("#FF0000" "#00FF00" "#0000FF" "#FFFF00" "#FF00FF" "#00FFFF")
    echo "${colors[$RANDOM % ${#colors[@]}]}"
}

# Function to get random report comments
get_random_report_comments() {
    local comments=(
        "Good progress this term"
        "Needs to improve in some areas"
        "Excellent performance"
        "Satisfactory work"
        "Below expectations"
    )
    echo "${comments[$RANDOM % ${#comments[@]}]}"
}

# Function to get random announcement title
get_random_announcement_title() {
    local titles=(
        "Important Notice"
        "School Event"
        "Academic Update"
        "Holiday Announcement"
        "Emergency Alert"
    )
    echo "${titles[$RANDOM % ${#titles[@]}]}"
}

# Function to get random announcement content
get_random_announcement_content() {
    local contents=(
        "Please be informed about the upcoming event."
        "Important information for all students and staff."
        "Changes to the academic schedule."
        "Holiday schedule announcement."
        "Emergency procedures update."
    )
    echo "${contents[$RANDOM % ${#contents[@]}]}"
}

# Function to get random announcement type
get_random_announcement_type() {
    local types=("GENERAL" "ACADEMIC" "EVENT" "EMERGENCY")
    echo "${types[$RANDOM % ${#types[@]}]}"
}

# Function to get random announcement priority
get_random_announcement_priority() {
    local priorities=("LOW" "MEDIUM" "HIGH" "URGENT")
    echo "${priorities[$RANDOM % ${#priorities[@]}]}"
}

# Function to get random target roles
get_random_target_roles() {
    local roles=("STUDENT" "TEACHER" "PARENT" "ADMIN")
    echo "${roles[$RANDOM % ${#roles[@]}]}"
}

# Function to get random forum post title
get_random_forum_post_title() {
    local titles=(
        "Discussion Topic"
        "Question about Curriculum"
        "School Event Planning"
        "Academic Support"
        "General Discussion"
    )
    echo "${titles[$RANDOM % ${#titles[@]}]}"
}

# Function to get random forum post content
get_random_forum_post_content() {
    local contents=(
        "Let's discuss this topic."
        "I have a question about the curriculum."
        "Planning for the upcoming event."
        "Need help with academic work."
        "General discussion about school matters."
    )
    echo "${contents[$RANDOM % ${#contents[@]}]}"
}

# Function to get random forum category
get_random_forum_category() {
    local categories=("GENERAL" "ACADEMIC" "EVENTS" "SUPPORT")
    echo "${categories[$RANDOM % ${#categories[@]}]}"
}

# Function to get random tags
get_random_tags() {
    local tags=("education" "school" "learning" "academic" "student")
    echo "${tags[$RANDOM % ${#tags[@]}]}"
}

# Function to get random comment content
get_random_comment_content() {
    local contents=(
        "I agree with this."
        "Good point!"
        "Let me add my thoughts."
        "Thanks for sharing."
        "Interesting perspective."
    )
    echo "${contents[$RANDOM % ${#contents[@]}]}"
}

# Function to get random monitoring metrics
get_random_monitoring_metrics() {
    declare -A metrics
    metrics[totalActiveTeachers]=$((10 + RANDOM % 41))
    metrics[totalActiveStudents]=$((200 + RANDOM % 801))
    metrics[totalLogins]=$((1000 + RANDOM % 4001))
    metrics[teacherLogins]=$((100 + RANDOM % 401))
    metrics[studentLogins]=$((800 + RANDOM % 3201))
    metrics[adminLogins]=$((50 + RANDOM % 151))
    metrics[attendanceRate]=$((70 + RANDOM % 31))
    metrics[assignmentSubmissions]=$((100 + RANDOM % 401))
    metrics[assignmentsGraded]=$((80 + RANDOM % 321))
    metrics[averageGradingTurnaroundHours]=$((1 + RANDOM % 72))
    metrics[curriculumCompletionRate]=$((60 + RANDOM % 41))
    metrics[systemUptimePercentage]=$((95 + RANDOM % 6))
    metrics[peakUsageHour]=$((8 + RANDOM % 9))
    metrics[totalAnnouncements]=$((5 + RANDOM % 16))
    metrics[announcementsAcknowledged]=$((3 + RANDOM % 13))
    metrics[forumPosts]=$((10 + RANDOM % 41))
    echo "${metrics[@]}"
}

# Function to get random alert metrics
get_random_alert_metrics() {
    declare -A metrics
    metrics[thresholdValue]=$((50 + RANDOM % 41))
    metrics[actualValue]=$((RANDOM % 101))
    metrics[metricName]=$("Attendance" "Performance" "System" "Behavior")
    echo "${metrics[@]}"
}

# Function to get random alert type
get_random_alert_type() {
    local types=("ATTENDANCE" "PERFORMANCE" "SYSTEM" "BEHAVIOR")
    echo "${types[$RANDOM % ${#types[@]}]}"
}

# Function to get random alert severity
get_random_alert_severity() {
    local severities=("LOW" "MEDIUM" "HIGH" "CRITICAL")
    echo "${severities[$RANDOM % ${#severities[@]}]}"
}

# Function to get random alert title
get_random_alert_title() {
    local titles=(
        "Attendance Alert"
        "Performance Warning"
        "System Issue"
        "Behavior Concern"
    )
    echo "${titles[$RANDOM % ${#titles[@]}]}"
}

# Function to get random alert description
get_random_alert_description() {
    local descriptions=(
        "Attendance below threshold"
        "Performance needs improvement"
        "System performance issue"
        "Behavioral concern reported"
    )
    echo "${descriptions[$RANDOM % ${#descriptions[@]}]}"
}

# Function to get random academic year
get_random_academic_year() {
    local years=("2022" "2023" "2024")
    echo "${years[$RANDOM % ${#years[@]}]}"
}

# Function to get random address
get_random_address() {
    local streets=("Main St" "Broadway" "Park Ave" "Market St" "High St")
    local cities=("Gaborone" "Francistown" "Maun" "Serowe" "Kanye")
    local street="${streets[$RANDOM % ${#streets[@]}]}"
    local city="${cities[$RANDOM % ${#cities[@]}]}"
    echo "$((1 + RANDOM % 999)) $street, $city, Botswana"
}

# Function to get authentication token
get_auth_token() {
    local email=$1
    local password=$2
    
    local auth_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}" \
        "${API_BASE_URL}/auth/login")
    
    if [ $? -ne 0 ]; then
        echo "Error: Failed to authenticate"
        return 1
    fi
    
    # Extract token from response
    local token=$(echo "$auth_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [ -z "$token" ]; then
        echo "Error: Failed to extract token from response"
        return 1
    fi
    
    echo "$token"
}

# Function to handle API errors
handle_api_error() {
    local response=$1
    local operation=$2
    
    # Check if response is empty
    if [ -z "$response" ]; then
        echo "Error during $operation: Empty response received"
        exit 1
    fi

    # Check if response is null
    if [ "$response" = "null" ]; then
        echo "Error during $operation: Null response received"
        exit 1
    fi

    # Validate JSON response
    if ! echo "$response" | jq -e . >/dev/null 2>&1; then
        echo "Error during $operation: Invalid JSON response"
        echo "Response: $response"
        exit 1
    fi

    # Extract status from response
    local status=$(echo "$response" | jq -r '.status')
    if [ "$status" = "FAILURE" ] || [ "$status" = "ERROR" ]; then
        local error_message=$(echo "$response" | jq -r '.message')
        echo "Error during $operation: $error_message"
        echo "Full response: $response"
        exit 1
    fi

    # Check HTTP status code if available
    local http_status=$(echo "$response" | jq -r '.httpStatus')
    if [ -n "$http_status" ] && [ "$http_status" != "null" ] && [ "$http_status" != "200" ]; then
        echo "Error during $operation: HTTP Status $http_status"
        echo "Full response: $response"
        exit 1
    fi

    return 0
}

# Function to make authenticated API request
make_api_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4
    
    # Validate inputs
    if [ -z "$method" ] || [ -z "$endpoint" ]; then
        echo "Error: Missing required parameters"
        echo "Method: $method"
        echo "Endpoint: $endpoint"
        exit 1
    fi

    if [ -z "$token" ]; then
        echo "Error: Missing authentication token"
        exit 1
    fi

    # Validate endpoint format
    if [[ ! "$endpoint" =~ ^/ ]]; then
        echo "Error: Endpoint must start with '/'"
        echo "Invalid endpoint: $endpoint"
        exit 1
    fi

    # Make the API request and capture both response and status code
    local response
    local curl_cmd="curl -s -w '\n%{http_code}' -X '$method' \
        -H 'Authorization: Bearer $token'"

    # Add Content-Type header for non-GET requests
    if [ "$method" != "GET" ]; then
        curl_cmd="$curl_cmd -H 'Content-Type: application/json'"
    fi

    # Add request data if provided
    if [ -n "$data" ]; then
        curl_cmd="$curl_cmd -d '$data'"
    fi

    # Add the URL
    curl_cmd="$curl_cmd '${API_BASE_URL}${endpoint}'"

    # Execute the curl command
    response=$(eval "$curl_cmd")

    # Extract status code from the last line
    local status_code=$(echo "$response" | tail -n1)
    # Remove status code from response
    response=$(echo "$response" | sed '$d')

    # Check if curl command failed
    if [ $? -ne 0 ]; then
        echo "Error: API request failed"
        echo "Endpoint: ${API_BASE_URL}${endpoint}"
        echo "Method: $method"
        if [ -n "$data" ]; then
            echo "Request data: $data"
        fi
        echo "Curl command: $curl_cmd"
        exit 1
    fi

    # Check HTTP status code
    if [ "$status_code" != "200" ]; then
        echo "Error: API request failed with status code $status_code"
        echo "Endpoint: ${API_BASE_URL}${endpoint}"
        echo "Method: $method"
        if [ -n "$data" ]; then
            echo "Request data: $data"
        fi
        echo "Response: $response"
        
        # Try to extract error message from JSON response
        if echo "$response" | jq -e . >/dev/null 2>&1; then
            local error_message=$(echo "$response" | jq -r '.message // empty')
            if [ -n "$error_message" ]; then
                echo "Error message: $error_message"
            fi
        fi
        
        exit 1
    fi

    # Validate JSON response
    if ! echo "$response" | jq -e . >/dev/null 2>&1; then
        echo "Error: Invalid JSON response"
        echo "Response: $response"
        exit 1
    fi

    echo "$response"
}

# Function to check if API is available
check_api_availability() {
    local max_retries=30
    local retry_count=0
    local wait_time=2
    
    echo "Checking API availability..."
    
    while [ $retry_count -lt $max_retries ]; do
        if curl -s "${API_BASE_URL}/health" > /dev/null; then
            echo "API is available"
            return 0
        fi
        
        echo "API not available yet, retrying in ${wait_time} seconds..."
        sleep $wait_time
        retry_count=$((retry_count + 1))
    done
    
    echo "Error: API not available after ${max_retries} retries"
    return 1
}

# Function to validate environment variables
validate_env_vars() {
    local required_vars=("API_BASE_URL" "ADMIN_EMAIL" "ADMIN_PASSWORD")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        echo "Error: Missing required environment variables:"
        printf '%s\n' "${missing_vars[@]}"
        return 1
    fi
    
    return 0
}

# Random data generation functions
get_random_department() {
    local departments=(
        "Computer Science"
        "Mathematics"
        "Physics"
        "Chemistry"
        "Biology"
        "Engineering"
        "Business Administration"
        "Economics"
        "Psychology"
        "Sociology"
    )
    echo "${departments[$((RANDOM % ${#departments[@]}))]}"
}

get_random_position() {
    local positions=(
        "Lecturer"
        "Senior Lecturer"
        "Associate Professor"
        "Professor"
        "Department Head"
        "Research Associate"
        "Teaching Assistant"
        "Lab Technician"
        "Administrative Assistant"
        "Program Coordinator"
    )
    echo "${positions[$((RANDOM % ${#positions[@]}))]}"
}

get_random_qualification() {
    local qualifications=(
        "Bachelor of Science"
        "Master of Science"
        "Doctor of Philosophy"
        "Bachelor of Arts"
        "Master of Arts"
        "Bachelor of Engineering"
        "Master of Engineering"
        "Bachelor of Business Administration"
        "Master of Business Administration"
        "Bachelor of Education"
    )
    echo "${qualifications[$((RANDOM % ${#qualifications[@]}))]}"
}

get_random_gender() {
    local genders=("MALE" "FEMALE")
    echo "${genders[$((RANDOM % ${#genders[@]}))]}"
}

get_random_nationality() {
    local nationalities=("CITIZEN" "PERMANENT_RESIDENT" "TEMPORARY_RESIDENT" "REFUGEE" "OTHER")
    echo "${nationalities[$((RANDOM % ${#nationalities[@]}))]}"
}

get_random_date_of_birth() {
    # Generate a random date between 1960 and 2000
    local year=$((1960 + RANDOM % 40))
    local month=$((1 + RANDOM % 12))
    local day=$((1 + RANDOM % 28))
    printf "%04d-%02d-%02d" "$year" "$month" "$day"
}

get_random_identity_number() {
    # Generate a random 9-digit number
    printf "%09d" $((RANDOM % 1000000000))
}

get_random_phone_number() {
    # Generate a random phone number in format +267XXXXXXXX
    printf "+267%08d" $((RANDOM % 100000000))
}

get_random_email() {
    local first_name=$1
    local last_name=$2
    local domains=("gmail.com" "yahoo.com" "hotmail.com" "outlook.com")
    local domain="${domains[$((RANDOM % ${#domains[@]}))]}"
    echo "${first_name,,}.${last_name,,}@${domain}"
}

get_random_address() {
    local streets=("Main" "Broad" "High" "Park" "Church" "Market" "School" "College" "University" "Science")
    local street="${streets[$((RANDOM % ${#streets[@]}))]}"
    local number=$((1 + RANDOM % 999))
    local cities=("Gaborone" "Francistown" "Molepolole" "Maun" "Serowe" "Kanye" "Mochudi" "Mahalapye" "Palapye" "Lobatse")
    local city="${cities[$((RANDOM % ${#cities[@]}))]}"
    echo "$number $street Street, $city, Botswana"
}

get_random_first_name() {
    local first_names=(
        "John" "Mary" "James" "Patricia" "Robert" "Jennifer" "Michael" "Linda" "William" "Elizabeth"
        "David" "Barbara" "Richard" "Susan" "Joseph" "Jessica" "Thomas" "Sarah" "Charles" "Karen"
        "Christopher" "Nancy" "Daniel" "Lisa" "Matthew" "Margaret" "Anthony" "Betty" "Mark" "Sandra"
    )
    echo "${first_names[$((RANDOM % ${#first_names[@]}))]}"
}

get_random_last_name() {
    local last_names=(
        "Smith" "Johnson" "Williams" "Brown" "Jones" "Garcia" "Miller" "Davis" "Rodriguez" "Martinez"
        "Hernandez" "Lopez" "Gonzalez" "Wilson" "Anderson" "Thomas" "Taylor" "Moore" "Jackson" "Martin"
        "Lee" "Perez" "Thompson" "White" "Harris" "Sanchez" "Clark" "Ramirez" "Lewis" "Robinson"
    )
    echo "${last_names[$((RANDOM % ${#last_names[@]}))]}"
}

# Function to generate random date
get_random_date() {
    local start_year=${1:-2000}  # Default start year if not provided
    local end_year=${2:-2024}    # Default end year if not provided
    local format=${3:-"%Y-%m-%d"} # Default format if not provided
    
    # Generate random year between start_year and end_year
    local year=$((start_year + RANDOM % (end_year - start_year + 1)))
    
    # Generate random month (1-12)
    local month=$((1 + RANDOM % 12))
    
    # Generate random day (1-28 to avoid invalid dates)
    local day=$((1 + RANDOM % 28))
    
    # Format the date according to the specified format
    case "$format" in
        "%Y-%m-%d")
            printf "%04d-%02d-%02d" "$year" "$month" "$day"
            ;;
        "%d/%m/%Y")
            printf "%02d/%02d/%04d" "$day" "$month" "$year"
            ;;
        *)
            printf "%04d-%02d-%02d" "$year" "$month" "$day"
            ;;
    esac
}

# Function to get random difficulty level
get_random_difficulty_level() {
    local levels=("EASY" "MEDIUM" "HARD" "EXPERT")
    echo "${levels[$((RANDOM % ${#levels[@]}))]}"
}

# Function to get random occupation
get_random_occupation() {
    local occupations=(
        "Teacher"
        "Engineer"
        "Doctor"
        "Lawyer"
        "Accountant"
        "Business Owner"
        "Government Employee"
        "Nurse"
        "Police Officer"
        "Banker"
        "IT Professional"
        "Sales Representative"
        "Manager"
        "Consultant"
        "Architect"
    )
    echo "${occupations[$((RANDOM % ${#occupations[@]}))]}"
}

# Function to get random company
get_random_company() {
    local companies=(
        "Botswana Power Corporation"
        "Debswana"
        "Botswana Telecommunications Corporation"
        "Botswana Railways"
        "Air Botswana"
        "Botswana Meat Commission"
        "Botswana Development Corporation"
        "Botswana Post"
        "Botswana Housing Corporation"
        "Botswana Unified Revenue Service"
        "Ministry of Education"
        "Ministry of Health"
        "Ministry of Agriculture"
        "Ministry of Finance"
        "Ministry of Infrastructure"
    )
    echo "${companies[$((RANDOM % ${#companies[@]}))]}"
}

# Function to get random phone number (Botswana format)
get_random_phone() {
    printf "+267%08d" $((RANDOM % 100000000))
}

# Function to get random school name
get_random_school_name() {
    local schools=(
        "Gaborone Primary School"
        "Francistown Secondary School"
        "Maun Community College"
        "Serowe High School"
        "Molepolole Academy"
        "Kanye International School"
        "Mahalapye Model School"
        "Lobatse Science School"
        "Palapye English Medium"
        "Mochudi Technical School"
    )
    echo "${schools[$((RANDOM % ${#schools[@]}))]}"
} 