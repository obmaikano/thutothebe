#!/bin/bash

# Test script to debug student attendance access issues
# This script tests various scenarios to identify the root cause

BASE_URL="http://localhost:8080/api/v1"
ATTENDANCE_API="$BASE_URL/attendance"

echo "=== Student Attendance Access Debug Test ==="
echo "Testing attendance access control issues..."

# Test 1: Check if the endpoint exists (without auth)
echo -e "\n1. Testing endpoint availability (should return 401 Unauthorized)..."
RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" "$ATTENDANCE_API/debug/access-check")
HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTP_CODE:[0-9]*$//')

echo "HTTP Status: $HTTP_CODE"
echo "Response: $BODY" | jq '.' 2>/dev/null || echo "Response: $BODY"

# Test 2: Check the specific student endpoint that's failing
echo -e "\n2. Testing student date-range endpoint (should return 401 Unauthorized)..."
STUDENT_ID=2
START_DATE="2025-05-31"
END_DATE="2025-06-05"
ACADEMIC_YEAR=2025

RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" "$ATTENDANCE_API/student/$STUDENT_ID/date-range?startDate=$START_DATE&endDate=$END_DATE&academicYear=$ACADEMIC_YEAR")
HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTP_CODE:[0-9]*$//')

echo "HTTP Status: $HTTP_CODE"
echo "Response: $BODY" | jq '.' 2>/dev/null || echo "Response: $BODY"

# Test 3: Check if we can access the login endpoint
echo -e "\n3. Testing login endpoint availability..."
RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}')
HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTP_CODE:[0-9]*$//')

echo "HTTP Status: $HTTP_CODE"
echo "Response: $BODY" | jq '.' 2>/dev/null || echo "Response: $BODY"

# Test 4: Check if we can access any public endpoint
echo -e "\n4. Testing public endpoint (Swagger UI)..."
RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" "$BASE_URL/swagger-ui.html")
HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)

echo "HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ]; then
    echo "✓ Application is accessible"
else
    echo "✗ Application may not be running properly"
fi

# Test 5: Check the application health
echo -e "\n5. Testing application health..."
RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" "$BASE_URL/actuator/health" 2>/dev/null)
HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTP_CODE:[0-9]*$//')

echo "HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Application health check passed"
    echo "Response: $BODY" | jq '.' 2>/dev/null || echo "Response: $BODY"
else
    echo "✗ Application health check failed or endpoint not available"
fi

echo -e "\n=== Summary ==="
echo "The tests above help identify:"
echo "1. Whether the application is running and accessible"
echo "2. Whether the attendance endpoints exist"
echo "3. Whether authentication is working"
echo "4. Whether the issue is with access control or authentication"
echo ""
echo "Next steps:"
echo "- If all endpoints return 401, the issue is authentication"
echo "- If endpoints return 403, the issue is access control"
echo "- If endpoints return 404, the issue is routing/mapping"
echo "- Check the application logs for more details" 