#!/bin/bash

# Test script for regions API endpoints
BASE_URL="http://localhost:8080/api/v1"

echo "Testing Regions API Endpoints..."
echo "================================"

# Test 1: Get all regions
echo "1. Testing GET /regions"
curl -s -X GET "$BASE_URL/regions" | jq '.' || echo "Failed to get regions"
echo ""

# Test 2: Get active regions
echo "2. Testing GET /regions/active"
curl -s -X GET "$BASE_URL/regions/active" | jq '.' || echo "Failed to get active regions"
echo ""

# Test 3: Get region by ID (assuming ID 1 exists)
echo "3. Testing GET /regions/1"
curl -s -X GET "$BASE_URL/regions/1" | jq '.' || echo "Failed to get region by ID"
echo ""

# Test 4: Get region by code
echo "4. Testing GET /regions/code/GAB"
curl -s -X GET "$BASE_URL/regions/code/GAB" | jq '.' || echo "Failed to get region by code"
echo ""

# Test 5: Create a new region (POST)
echo "5. Testing POST /regions (Create new region)"
curl -s -X POST "$BASE_URL/regions" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TEST",
    "name": "Test Region",
    "description": "Test region for API testing",
    "active": true
  }' | jq '.' || echo "Failed to create region"
echo ""

# Test 6: Update a region (PUT) - using the newly created region
echo "6. Testing PUT /regions/8 (Update region)"
curl -s -X PUT "$BASE_URL/regions/8" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 8,
    "code": "TEST",
    "name": "Updated Test Region",
    "description": "Updated test region description",
    "active": true
  }' | jq '.' || echo "Failed to update region"
echo ""

# Test 7: Activate a region
echo "7. Testing POST /regions/8/activate"
curl -s -X POST "$BASE_URL/regions/8/activate" | jq '.' || echo "Failed to activate region"
echo ""

# Test 8: Deactivate a region
echo "8. Testing POST /regions/8/deactivate"
curl -s -X POST "$BASE_URL/regions/8/deactivate" | jq '.' || echo "Failed to deactivate region"
echo ""

# Test 9: Delete a region
echo "9. Testing DELETE /regions/8"
curl -s -X DELETE "$BASE_URL/regions/8" | jq '.' || echo "Failed to delete region"
echo ""

echo "All tests completed!" 