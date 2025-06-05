#!/bin/bash

# Run All Script
# This script runs all data generation scripts in the correct order

# Load environment variables
if [ ! -f .env ]; then
    echo "Error: .env file not found"
    exit 1
fi
source .env

# Load helper functions
if [ -f scripts/functions.sh ]; then
    source scripts/functions.sh
else
    echo "Error: functions.sh not found"
    exit 1
fi

# Function to check if a script exists and is executable
check_script() {
    local script=$1
    if [ ! -f "$script" ]; then
        echo "Error: Script $script not found"
        return 1
    fi
    if [ ! -x "$script" ]; then
        echo "Error: Script $script is not executable"
        return 1
    fi
    return 0
}

# Function to run a script and check its status
run_script() {
    local script=$1
    local description=$2
    
    echo "Running $description..."
    if ! check_script "$script"; then
        echo "Skipping $description due to script issues"
        return 1
    fi
    
    if ! "$script"; then
        echo "Error: Failed to run $description"
        return 1
    fi
    
    echo "$description completed successfully"
    return 0
}

# Create logs directory if it doesn't exist
mkdir -p logs

# Start logging
exec 1> >(tee -a "logs/run-all-$(date +%Y%m%d-%H%M%S).log")
exec 2>&1

echo "Starting data generation at $(date)"

# Run scripts in order
echo "Starting data generation..."

# Register admin user first
echo "Running admin registration..."
./scripts/00-register-admin.sh 2>&1 | tee logs/00-register-admin.log
if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo "Error: Admin registration failed"
    exit 1
fi

## Run base setup
#echo "Running base setup..."
#./scripts/01-base-setup.sh 2>&1 | tee logs/01-base-setup.log
#if [ ${PIPESTATUS[0]} -ne 0 ]; then
#    echo "Error: Base setup failed"
#    exit 1
#fi
#
## Run staff data generation
#echo "Running staff data generation..."
#./scripts/02-staff-data.sh 2>&1 | tee logs/02-staff-data.log
#if [ ${PIPESTATUS[0]} -ne 0 ]; then
#    echo "Error: Staff data generation failed"
#    exit 1
#fi
#
## Run student data generation
#echo "Running student data generation..."
#./scripts/03-student-data.sh 2>&1 | tee logs/03-student-data.log
#if [ ${PIPESTATUS[0]} -ne 0 ]; then
#    echo "Error: Student data generation failed"
#    exit 1
#fi
#
## Run curriculum data generation
#echo "Running curriculum data generation..."
#./scripts/04-curriculum-data.sh 2>&1 | tee logs/04-curriculum-data.log
#if [ ${PIPESTATUS[0]} -ne 0 ]; then
#    echo "Error: Curriculum data generation failed"
#    exit 1
#fi
#
## Run assessment data generation
#echo "Running assessment data generation..."
#./scripts/05-assessment-data.sh 2>&1 | tee logs/05-assessment-data.log
#if [ ${PIPESTATUS[0]} -ne 0 ]; then
#    echo "Error: Assessment data generation failed"
#    exit 1
#fi

echo "Data generation completed successfully at $(date)" 