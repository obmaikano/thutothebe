#!/bin/bash

# Script to register an admin user first
# This script registers an admin user using the credentials from the .env file

# Load environment variables
if [ ! -f .env ]; then
    echo "Error: .env file not found"
    exit 1
fi
source .env

# Load functions
if [ ! -f scripts/functions.sh ]; then
    echo "Error: functions.sh not found"
    exit 1
fi
source scripts/functions.sh

## Validate environment variables
#if ! validate_env_vars; then
#    exit 1
#fi

# Check if API is available
if ! check_api_availability; then
    exit 1
fi

# Try to login first to check if admin exists
#echo "Checking if admin user exists..."
#login_response=$(curl -s -X POST \
#    -H "Content-Type: application/json" \
#    -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
#    "${API_BASE_URL}/auth/login")
#
#if echo "$login_response" | jq -e '.data.token' >/dev/null 2>&1; then
#    echo "Admin user already exists, skipping registration"
#    exit 0
#fi

# Register admin user
echo "Registering admin user..."
register_data="{
    \"email\": \"$ADMIN_EMAIL\",
    \"password\": \"$ADMIN_PASSWORD\",
    \"firstName\": \"Admin\",
    \"lastName\": \"User\",
    \"surname\": \"User\",
    \"nationality\": \"CITIZEN\",
    \"dateOfBirth\": \"1980-01-01\",
    \"gender\": \"FEMALE\",
    \"identityNumber\": \"123426789\",
    \"qualification\": \"Bachelor of Science in Computer Science\",
    \"role\": \"SUPER_ADMIN\"
}"

response=$(make_api_request "POST" "/auth/register" "$register_data")
if [ $? -ne 0 ]; then
    echo "Error: Failed to register admin user"
    exit 1
fi

if ! handle_api_error "$response" "admin registration"; then
    # Check if error is due to duplicate email
    if echo "$response" | jq -r '.message' | grep -q "already exists"; then
        echo "Admin user already exists, skipping registration"
        exit 0
    fi
    exit 1
fi

echo "Admin user registered successfully."