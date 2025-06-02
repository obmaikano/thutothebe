#!/bin/bash

# Test script to verify the StackOverflowError fix for subject assignment

BASE_URL="http://localhost:8080/api/v1"

echo "Testing Subject Assignment API to verify StackOverflowError fix..."

# Step 1: Login to get JWT token
echo "Step 1: Authenticating..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@thutothebe.org",
    "password": "admin123"
  }')

echo "Login response: $LOGIN_RESPONSE"

# Extract token from response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"data":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "Failed to get authentication token. Trying alternative admin credentials..."
    
    # Try alternative credentials
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "superadmin@thutothebe.org",
        "password": "superadmin123"
      }')
    
    echo "Alternative login response: $LOGIN_RESPONSE"
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"data":"[^"]*"' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
    echo "Failed to authenticate. Cannot proceed with test."
    exit 1
fi

echo "Authentication successful. Token: ${TOKEN:0:50}..."

# Step 2: Get departments
echo -e "\nStep 2: Getting departments..."
DEPARTMENTS_RESPONSE=$(curl -s -X GET "$BASE_URL/departments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "Departments response: $DEPARTMENTS_RESPONSE"

# Extract first department ID
DEPT_ID=$(echo $DEPARTMENTS_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$DEPT_ID" ]; then
    echo "No departments found. Creating a test department..."
    
    # Create a test department
    CREATE_DEPT_RESPONSE=$(curl -s -X POST "$BASE_URL/departments" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "name": "Test Department",
        "description": "Test department for subject assignment",
        "schoolId": 1
      }')
    
    echo "Create department response: $CREATE_DEPT_RESPONSE"
    DEPT_ID=$(echo $CREATE_DEPT_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
fi

if [ -z "$DEPT_ID" ]; then
    echo "Failed to get or create department. Cannot proceed with test."
    exit 1
fi

echo "Using department ID: $DEPT_ID"

# Step 3: Get subjects
echo -e "\nStep 3: Getting subjects..."
SUBJECTS_RESPONSE=$(curl -s -X GET "$BASE_URL/subjects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "Subjects response: $SUBJECTS_RESPONSE"

# Extract first subject ID
SUBJECT_ID=$(echo $SUBJECTS_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$SUBJECT_ID" ]; then
    echo "No subjects found. Creating a test subject..."
    
    # Create a test subject
    CREATE_SUBJECT_RESPONSE=$(curl -s -X POST "$BASE_URL/subjects" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "code": "TEST001",
        "name": "Test Subject",
        "description": "Test subject for assignment"
      }')
    
    echo "Create subject response: $CREATE_SUBJECT_RESPONSE"
    SUBJECT_ID=$(echo $CREATE_SUBJECT_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
fi

if [ -z "$SUBJECT_ID" ]; then
    echo "Failed to get or create subject. Cannot proceed with test."
    exit 1
fi

echo "Using subject ID: $SUBJECT_ID"

# Step 4: Test subject assignment (this should NOT cause StackOverflowError)
echo -e "\nStep 4: Testing subject assignment..."
echo "Assigning subject $SUBJECT_ID to department $DEPT_ID..."

ASSIGNMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/departments/$DEPT_ID/subjects/$SUBJECT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "Assignment response: $ASSIGNMENT_RESPONSE"

# Check if the response indicates success or if there was a StackOverflowError
if echo "$ASSIGNMENT_RESPONSE" | grep -q "StackOverflowError"; then
    echo "❌ FAILED: StackOverflowError still occurs!"
    exit 1
elif echo "$ASSIGNMENT_RESPONSE" | grep -q '"status":"SUCCESS"'; then
    echo "✅ SUCCESS: Subject assignment completed without StackOverflowError!"
elif echo "$ASSIGNMENT_RESPONSE" | grep -q "already assigned"; then
    echo "✅ SUCCESS: Subject already assigned (no StackOverflowError occurred)"
else
    echo "⚠️  UNKNOWN: Response doesn't indicate clear success or failure"
    echo "Response: $ASSIGNMENT_RESPONSE"
fi

echo -e "\nTest completed!" 