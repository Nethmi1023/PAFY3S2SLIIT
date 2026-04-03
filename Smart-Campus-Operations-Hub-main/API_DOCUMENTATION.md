# Facilities Management System - API Documentation

## Overview
Complete REST API for managing university facilities, resources, and equipment. This module handles creation, modification, and retrieval of facility information with role-based access control.

## Base URL
```
http://localhost:8080/api
```

## Authentication
The API uses Basic Authentication. Include credentials in request headers:
```
Authorization: Basic base64(username:password)
```

### Demo Credentials
- **Admin User:** username: `admin`, password: `admin123`
- **Normal User:** username: `user`, password: `user123`

## Endpoints

### 1. Create Resource
**POST** `/resources`
- **Role Required:** ADMIN
- **Description:** Create a new facility resource

**Request Body:**
```json
{
  "name": "Computer Lab A1",
  "type": "LAB",
  "category": "Computer Science",
  "description": "Advanced computer lab with 40 workstations",
  "capacity": 40,
  "location": "Building A, Floor 2",
  "availableFrom": "08:00",
  "availableTo": "18:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/lab.jpg"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Computer Lab A1",
  "type": "LAB",
  "category": "Computer Science",
  "description": "Advanced computer lab with 40 workstations",
  "capacity": 40,
  "location": "Building A, Floor 2",
  "availableFrom": "08:00",
  "availableTo": "18:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/lab.jpg",
  "createdAt": "2024-03-31T10:30:00",
  "updatedAt": "2024-03-31T10:30:00"
}
```

### 2. Get All Resources
**GET** `/resources`
- **Role Required:** Public
- **Description:** Get all resources with pagination and sorting

**Query Parameters:**
- `page` (optional, default: 0): Page number
- `size` (optional, default: 10): Number of items per page
- `sort` (optional, default: id,desc): Sort by field

**Example:**
```
GET /resources?page=0&size=10&sort=name,asc
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Computer Lab A1",
      "type": "LAB",
      "capacity": 40,
      "location": "Building A, Floor 2",
      "status": "AVAILABLE",
      "createdAt": "2024-03-31T10:30:00",
      "updatedAt": "2024-03-31T10:30:00"
    }
  ],
  "totalElements": 25,
  "totalPages": 3,
  "currentPage": 0,
  "pageSize": 10
}
```

### 3. Get Resource by ID
**GET** `/resources/{id}`
- **Role Required:** Public
- **Description:** Get detailed information about a specific resource

**Path Parameters:**
- `id` (required): Resource ID

**Example:**
```
GET /resources/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Computer Lab A1",
  "type": "LAB",
  "category": "Computer Science",
  "description": "Advanced computer lab with 40 workstations",
  "capacity": 40,
  "location": "Building A, Floor 2",
  "availableFrom": "08:00",
  "availableTo": "18:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/lab.jpg",
  "createdAt": "2024-03-31T10:30:00",
  "updatedAt": "2024-03-31T10:30:00"
}
```

### 4. Update Resource
**PUT** `/resources/{id}`
- **Role Required:** ADMIN
- **Description:** Update an existing resource

**Path Parameters:**
- `id` (required): Resource ID

**Request Body:**
```json
{
  "name": "Computer Lab A1",
  "type": "LAB",
  "category": "Computer Science",
  "description": "Advanced computer lab with 40 workstations",
  "capacity": 45,
  "location": "Building A, Floor 2",
  "availableFrom": "08:00",
  "availableTo": "18:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/lab.jpg"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Computer Lab A1",
  "type": "LAB",
  "capacity": 45,
  ...
}
```

### 5. Delete Resource
**DELETE** `/resources/{id}`
- **Role Required:** ADMIN
- **Description:** Delete a resource

**Path Parameters:**
- `id` (required): Resource ID

**Response (204 No Content)**

### 6. Search Resources
**GET** `/resources/search/keyword`
- **Role Required:** Public
- **Description:** Search resources by keyword (name, location, description)

**Query Parameters:**
- `keyword` (required): Search term
- `page` (optional, default: 0): Page number
- `size` (optional, default: 10): Number of items per page

**Example:**
```
GET /resources/search/keyword?keyword=lab&page=0&size=10
```

**Response (200 OK):** Same as Get All Resources

### 7. Filter by Type
**GET** `/resources/filter/type`
- **Role Required:** Public
- **Description:** Filter resources by type

**Query Parameters:**
- `type` (required): LAB, HALL, ROOM, or EQUIPMENT
- `page` (optional, default: 0): Page number
- `size` (optional, default: 10): Number of items per page

**Example:**
```
GET /resources/filter/type?type=LAB&page=0&size=10
```

### 8. Filter by Status
**GET** `/resources/filter/status`
- **Role Required:** Public
- **Description:** Filter resources by status

**Query Parameters:**
- `status` (required): AVAILABLE, UNAVAILABLE, or MAINTENANCE
- `page` (optional, default: 0): Page number
- `size` (optional, default: 10): Number of items per page

**Example:**
```
GET /resources/filter/status?status=AVAILABLE&page=0&size=10
```

### 9. Filter by Location
**GET** `/resources/filter/location`
- **Role Required:** Public
- **Description:** Filter resources by location

**Query Parameters:**
- `location` (required): Location name
- `page` (optional, default: 0): Page number
- `size` (optional, default: 10): Number of items per page

**Example:**
```
GET /resources/filter/location?location=Building%20A&page=0&size=10
```

### 10. Filter by Capacity
**GET** `/resources/filter/capacity`
- **Role Required:** Public
- **Description:** Filter resources by minimum capacity

**Query Parameters:**
- `capacity` (required): Minimum capacity
- `page` (optional, default: 0): Page number
- `size` (optional, default: 10): Number of items per page

**Example:**
```
GET /resources/filter/capacity?capacity=30&page=0&size=10
```

### 11. Filter by Type and Capacity
**GET** `/resources/filter/type-capacity`
- **Role Required:** Public
- **Description:** Filter resources by type and minimum capacity

**Query Parameters:**
- `type` (required): LAB, HALL, ROOM, or EQUIPMENT
- `capacity` (required): Minimum capacity
- `page` (optional, default: 0): Page number
- `size` (optional, default: 10): Number of items per page

**Example:**
```
GET /resources/filter/type-capacity?type=LAB&capacity=30&page=0&size=10
```

### 12. Get Available Resources
**GET** `/resources/available/list`
- **Role Required:** Public
- **Description:** Get all available resources

**Response (200 OK):** Array of available resources

## Validation Rules

| Field | Rule |
|-------|------|
| `name` | Required, not empty |
| `type` | Required, must be LAB, HALL, ROOM, or EQUIPMENT |
| `capacity` | Required, must be greater than 0 |
| `availableFrom` | Format: HH:mm (e.g., 08:00) |
| `availableTo` | Format: HH:mm, must be after availableFrom |

## Error Responses

### 400 Bad Request
```json
{
  "timestamp": "2024-03-31T10:30:00",
  "status": 400,
  "error": "Validation Failed",
  "errors": {
    "name": "Resource name is required",
    "capacity": "Capacity must be greater than 0"
  },
  "path": "/api/resources"
}
```

### 401 Unauthorized
```json
{
  "timestamp": "2024-03-31T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid credentials",
  "path": "/api/resources"
}
```

### 403 Forbidden
```json
{
  "timestamp": "2024-03-31T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied",
  "path": "/api/resources"
}
```

### 404 Not Found
```json
{
  "timestamp": "2024-03-31T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found with id: 999",
  "path": "/api/resources/999"
}
```

### 500 Internal Server Error
```json
{
  "timestamp": "2024-03-31T10:30:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "path": "/api/resources"
}
```

## Resource Types
- **LAB**: Laboratory facilities
- **HALL**: Conference halls and auditoriums
- **ROOM**: Meeting rooms and classrooms
- **EQUIPMENT**: Equipment and machinery

## Resource Status
- **AVAILABLE**: Resource is available for use
- **UNAVAILABLE**: Resource is not available
- **MAINTENANCE**: Resource is under maintenance

## Available Days
- MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY

## Integration Notes

This module is designed to integrate seamlessly with the booking/reservation module:

1. **Resource Availability**: Check resource availability status before allowing bookings
2. **Capacity Validation**: Ensure booking party size doesn't exceed resource capacity
3. **Time Slots**: Use availableFrom and availableTo for time slot validation
4. **Day Availability**: Use availableDays to determine when resources can be booked

## Database Schema

The application uses an H2 in-memory database for development with the following table:

```sql
CREATE TABLE resources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    capacity INTEGER NOT NULL,
    location VARCHAR(255),
    available_from TIME,
    available_to TIME,
    status VARCHAR(50) NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resource_available_days (
    resource_id BIGINT NOT NULL,
    available_day VARCHAR(20) NOT NULL,
    FOREIGN KEY (resource_id) REFERENCES resources(id)
);
```

## Rate Limiting
Not currently implemented. Consider adding in production.

## CORS Configuration
- Allowed origins: http://localhost:3000, http://localhost:3001
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Max age: 3600 seconds
