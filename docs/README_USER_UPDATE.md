# User Update Without Role and Password

This document describes the new functionality that allows updating user information without changing their role and password.

## Overview

The new endpoints allow administrators to update user profile information while preserving the user's role and password. This is useful for updating personal information, contact details, and other profile data without affecting the user's authentication credentials or permissions.

## Endpoints

### General User Update

```
PUT /users/{id}/update-profile
```

### Parent-Specific Update

```
PUT /parents/{id}/update-profile
```

This endpoint includes additional validation to ensure the user being updated is actually a parent.

### Parameters

- `id` (path parameter): The ID of the user to update

### Request Body

The request body should contain a `UserDTO` object with the fields you want to update. The following fields will be updated:

- `firstName` - User's first name
- `lastName` - User's last name  
- `email` - User's email address
- `qualification` - User's qualification (for teachers)
- `schoolId` - Associated school ID
- `surname` - User's surname
- `gender` - User's gender
- `nationality` - User's nationality
- `dateOfBirth` - User's date of birth
- `identityNumber` - User's identity number
- `birthCertificateNumber` - User's birth certificate number

### Fields That Are Ignored

The following fields in the request body will be **ignored** and will not be updated:

- `role` - User's role (STUDENT, TEACHER, PARENT, etc.)
- `password` - User's password

### Example Request

```json
{
  "firstName": "Jane",
  "lastName": "Smith", 
  "email": "jane.smith@example.com",
  "qualification": "Master's Degree",
  "surname": "Smith",
  "gender": "FEMALE",
  "nationality": "CITIZEN",
  "dateOfBirth": "1990-01-01",
  "identityNumber": "9001010001088",
  "password": "newPassword",  // This will be ignored
  "role": "STUDENT"           // This will be ignored
}
```

### Example Response

```json
{
  "status": "SUCCESS",
  "message": "Parent profile updated successfully",
  "data": {
    "id": 1,
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "role": "PARENT",           // Unchanged from original
    "qualification": "Master's Degree",
    "surname": "Smith",
    "gender": "FEMALE",
    "nationality": "CITIZEN",
    "dateOfBirth": "1990-01-01",
    "identityNumber": "9001010001088"
  }
}
```

## Implementation Details

### Service Layer

The implementation includes:

1. **UserMapper.updateEntityWithoutRoleAndPassword()** - A new mapper method that updates entity fields while preserving role and password
2. **UserService.updateWithoutRoleAndPassword()** - A new service method that uses the mapper to perform the update
3. **UserController.updateWithoutRoleAndPassword()** - A new controller endpoint that exposes this functionality
4. **ParentController.updateParentProfile()** - A parent-specific endpoint with additional validation

### Security Considerations

- The endpoints preserve user roles, preventing accidental privilege escalation
- Passwords remain unchanged, maintaining authentication security
- The parent-specific endpoint includes validation to ensure only parent users can be updated
- The endpoints follow the same authorization patterns as other user management endpoints

### Error Handling

- Returns `400 Bad Request` if the user is not found
- Returns `400 Bad Request` if validation fails on any of the updated fields
- For the parent endpoint: Returns `400 Bad Request` if the user is not a parent
- Follows the standard error response format used throughout the application

## Usage Scenarios

These endpoints are particularly useful for:

1. **Profile Updates**: Allowing users or administrators to update personal information
2. **Data Corrections**: Fixing incorrect personal details without affecting permissions
3. **Contact Information Updates**: Updating email addresses and other contact details
4. **Administrative Updates**: Bulk updates of user information by administrators
5. **Parent Management**: Specifically updating parent information while maintaining their role

## Testing

The functionality is covered by comprehensive unit tests that verify:

- Successful updates preserve role and password
- All other fields are updated correctly
- Proper error handling for non-existent users
- Parent-specific validation works correctly
- Validation of input data 