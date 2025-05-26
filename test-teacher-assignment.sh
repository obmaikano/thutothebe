#!/bin/bash

# Test script for teacher assignment functionality
BASE_URL="http://localhost:8080"

echo "=== Testing Teacher Assignment Functionality ==="

# Test 1: Get all classes with teachers
echo "1. Getting all classes with teachers..."
curl -s -X GET "$BASE_URL/classes/with-teachers" \
  -H "Content-Type: application/json" | jq '.'

echo -e "\n"

# Test 2: Get a specific class with teachers (replace 1 with actual class ID)
CLASS_ID=1
echo "2. Getting class $CLASS_ID with teachers..."
curl -s -X GET "$BASE_URL/classes/$CLASS_ID/with-teachers" \
  -H "Content-Type: application/json" | jq '.'

echo -e "\n"

# Test 3: Debug teacher assignments for a class
echo "3. Debug teacher assignments for class $CLASS_ID..."
curl -s -X GET "$BASE_URL/classes/$CLASS_ID/debug-teachers" \
  -H "Content-Type: application/json" | jq '.'

echo -e "\n"

# Test 4: Get teachers assigned to a class
echo "4. Getting teachers assigned to class $CLASS_ID..."
curl -s -X GET "$BASE_URL/teachers/class/$CLASS_ID" \
  -H "Content-Type: application/json" | jq '.'

echo -e "\n"

# Test 5: Assign a teacher to a class (replace with actual teacher ID)
TEACHER_ID=1
echo "5. Assigning teacher $TEACHER_ID to class $CLASS_ID..."
curl -s -X POST "$BASE_URL/classes/$CLASS_ID/teacher/$TEACHER_ID" \
  -H "Content-Type: application/json" | jq '.'

echo -e "\n"

# Test 6: Verify assignment by getting class with teachers again
echo "6. Verifying assignment - getting class $CLASS_ID with teachers..."
curl -s -X GET "$BASE_URL/classes/$CLASS_ID/with-teachers" \
  -H "Content-Type: application/json" | jq '.'

echo -e "\n=== Test Complete ===" 