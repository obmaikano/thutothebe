#!/bin/bash

# Test script to verify student dashboard access control fix
# This tests the scenario from the conversation summary:
# - Student user (tebogo.kgosi@thutothebe.org, User ID 8) accessing Student ID 2's dashboard
# - Should now work after the access control fix

BASE_URL="http://localhost:8080"
API_BASE="$BASE_URL/api/v1"

echo "=== Testing Student Dashboard Access Control Fix ==="
echo

# Step 1: Login as the student user
echo "1. Logging in as student user (tebogo.kgosi@thutothebe.org)..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tebogo.kgosi@thutothebe.org",
    "password": "Password123!"
  }')

echo "Login response: $LOGIN_RESPONSE"

# Extract JWT token
JWT_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$JWT_TOKEN" ]; then
    echo "❌ Failed to get JWT token. Login may have failed."
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo "✅ Successfully obtained JWT token"
echo "Token (first 50 chars): ${JWT_TOKEN:0:50}..."
echo

# Step 2: Verify current user authentication
echo "2. Verifying current user authentication..."
CURRENT_USER_RESPONSE=$(curl -s -X GET "$API_BASE/users/current" \
  -H "Authorization: Bearer $JWT_TOKEN")

echo "Current user info: $CURRENT_USER_RESPONSE"
echo

# Step 3: Test student dashboard access (Student ID 2)
echo "3. Testing student dashboard access (Student ID 2)..."
DASHBOARD_RESPONSE=$(curl -s -X GET "$API_BASE/students/2/dashboard" \
  -H "Authorization: Bearer $JWT_TOKEN")

echo "Dashboard response: $DASHBOARD_RESPONSE"

if echo "$DASHBOARD_RESPONSE" | grep -q '"status":"SUCCESS"'; then
    echo "✅ SUCCESS: Student dashboard access is working!"
else
    echo "❌ ERROR: Student dashboard access failed"
    echo "   Response: $DASHBOARD_RESPONSE"
fi
echo

# Step 4: Test other student endpoints that were fixed
echo "4. Testing other student endpoints that were fixed..."

echo "4a. Testing student courses endpoint..."
COURSES_RESPONSE=$(curl -s -X GET "$API_BASE/students/2/courses" \
  -H "Authorization: Bearer $JWT_TOKEN")
echo "Courses response: $COURSES_RESPONSE"

echo "4b. Testing student assignments endpoint..."
ASSIGNMENTS_RESPONSE=$(curl -s -X GET "$API_BASE/students/2/assignments" \
  -H "Authorization: Bearer $JWT_TOKEN")
echo "Assignments response: $ASSIGNMENTS_RESPONSE"

echo "4c. Testing student performance endpoint..."
PERFORMANCE_RESPONSE=$(curl -s -X GET "$API_BASE/students/2/performance" \
  -H "Authorization: Bearer $JWT_TOKEN")
echo "Performance response: $PERFORMANCE_RESPONSE"

echo
echo "=== Test Summary ==="

# Check all responses
if echo "$DASHBOARD_RESPONSE" | grep -q '"status":"SUCCESS"'; then
    echo "Dashboard: ✅ SUCCESS"
else
    echo "Dashboard: ❌ ERROR"
fi

if echo "$COURSES_RESPONSE" | grep -q '"status":"SUCCESS"'; then
    echo "Courses: ✅ SUCCESS"
else
    echo "Courses: ❌ ERROR"
fi

if echo "$ASSIGNMENTS_RESPONSE" | grep -q '"status":"SUCCESS"'; then
    echo "Assignments: ✅ SUCCESS"
else
    echo "Assignments: ❌ ERROR"
fi

if echo "$PERFORMANCE_RESPONSE" | grep -q '"status":"SUCCESS"'; then
    echo "Performance: ✅ SUCCESS"
else
    echo "Performance: ❌ ERROR"
fi

echo

# Step 5: Test negative case - accessing different student's data (should fail)
echo "5. Testing negative case - accessing different student's data (should fail)..."
OTHER_STUDENT_RESPONSE=$(curl -s -X GET "$API_BASE/students/1/dashboard" \
  -H "Authorization: Bearer $JWT_TOKEN")
echo "Other student response: $OTHER_STUDENT_RESPONSE"

if echo "$OTHER_STUDENT_RESPONSE" | grep -q '"status":"ERROR"'; then
    echo "✅ Good: Access control is working - denied access to other student's data"
else
    echo "⚠️  Warning: Access control may not be working - allowed access to other student's data"
fi

echo
echo "=== Test Complete ===" 