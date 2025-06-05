#!/bin/bash

# Test script to verify student attendance access fixes
# This script tests the attendance access control for students

BASE_URL="http://localhost:8080"
ATTENDANCE_API="$BASE_URL/attendance"

echo "=== Student Attendance Access Test ==="
echo "Testing attendance access control fixes..."

# Test 1: Debug access check endpoint
echo -e "\n1. Testing debug access check endpoint..."
curl -s -X GET "$ATTENDANCE_API/debug/access-check" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" | jq '.'

# Test 2: Get student's own attendance records
echo -e "\n2. Testing student access to own attendance records..."
STUDENT_ID=1  # Replace with actual student ID
curl -s -X GET "$ATTENDANCE_API/student/$STUDENT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" | jq '.'

# Test 3: Get all attendance records (should be filtered)
echo -e "\n3. Testing filtered attendance records access..."
curl -s -X GET "$ATTENDANCE_API" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" | jq '.'

# Test 4: Get attendance statistics for student
echo -e "\n4. Testing attendance statistics access..."
ACADEMIC_YEAR=2024
curl -s -X GET "$ATTENDANCE_API/stats/student/$STUDENT_ID/academic-year/$ACADEMIC_YEAR" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" | jq '.'

# Test 5: Get attendance percentage for student
echo -e "\n5. Testing attendance percentage access..."
curl -s -X GET "$ATTENDANCE_API/percentage/student/$STUDENT_ID/academic-year/$ACADEMIC_YEAR" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" | jq '.'

echo -e "\n=== Test completed ==="
echo "Check the responses above for:"
echo "- 200 OK status for allowed operations"
echo "- 403 Forbidden for denied operations"
echo "- Proper data filtering based on student access rights"
echo ""
echo "Debug information should show:"
echo "- currentUserId: [student's user ID]"
echo "- accessibleUserIds: [list including student's own ID]"
echo "- canAccessSelf: true"
echo "- hasStudentRecord: true"
echo "- studentClass: [class ID if assigned]" 