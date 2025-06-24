#!/bin/bash

# Script to assign teacher 1 to some classes for testing
BASE_URL="http://localhost:8080"

echo "=== Assigning Teacher 1 to Classes ==="

# First, let's get the admin token
echo "1. Getting admin token..."
AUTH_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"email":"admin@thutothebe.edu.bw","password":"Admin123!"}' \
  "$BASE_URL/auth/login")

TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d '"' -f4)
if [ -z "$TOKEN" ]; then
    echo "Failed to authenticate. Response: $AUTH_RESPONSE"
    exit 1
fi

echo "Token obtained successfully"

# Get all classes
echo "2. Getting all classes..."
CLASSES_RESPONSE=$(curl -s -X GET -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/classes")

echo "Classes response: $CLASSES_RESPONSE"

# Extract class IDs (assuming first 3 classes)
CLASS_IDS=($(echo "$CLASSES_RESPONSE" | jq -r '.data[0:3][].id'))

echo "Class IDs to assign: ${CLASS_IDS[@]}"

# Assign teacher 1 to each class
TEACHER_ID=1
for CLASS_ID in "${CLASS_IDS[@]}"; do
    echo "3. Assigning teacher $TEACHER_ID to class $CLASS_ID..."
    
    ASSIGNMENT_RESPONSE=$(curl -s -X POST -H "Authorization: Bearer $TOKEN" \
      "$BASE_URL/classes/$CLASS_ID/teacher/$TEACHER_ID")
    
    echo "Assignment response for class $CLASS_ID: $ASSIGNMENT_RESPONSE"
done

# Test the endpoint that was failing
echo "4. Testing the failing endpoint..."
TEST_RESPONSE=$(curl -s -X GET -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/classes/teacher/$TEACHER_ID")

echo "Test endpoint response: $TEST_RESPONSE"

# Test the debug endpoint
echo "5. Testing debug endpoint..."
DEBUG_RESPONSE=$(curl -s -X GET -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/classes/teacher/$TEACHER_ID/debug")

echo "Debug endpoint response: $DEBUG_RESPONSE"

echo "=== Script Complete ===" 