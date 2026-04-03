# MongoDB Migration Testing Guide

This document provides comprehensive testing samples for the H2 to MongoDB migration of the Facilities Management API.

## Prerequisites

1. **MongoDB Server Running**: Ensure MongoDB is running on `localhost:27017`
   ```bash
   # Start MongoDB (Windows)
   mongod
   
   # Or with MongoDB Atlas connection string
   # mongodb+srv://username:password@cluster.mongodb.net/facilitiesdb
   ```

2. **Spring Boot Application Running**: Start the backend on `http://localhost:8080`
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

3. **Authentication**: Obtain JWT token from auth endpoint (if required)

---

## API Endpoints Testing

### 1. CREATE Resource (POST)

**Endpoint**: `POST /api/resources`

**Required Headers**:
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>  (if secured)
```

**Request Body - Sample 1: Computer Lab**:
```json
{
  "name": "Computer Lab A",
  "type": "COMPUTER_LAB",
  "category": "Technology",
  "description": "Modern computer lab with 50 workstations equipped with latest software",
  "capacity": 50,
  "location": "Building A, Floor 2",
  "availableFrom": "08:00",
  "availableTo": "17:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/computer-lab.jpg"
}
```

**Request Body - Sample 2: Meeting Room**:
```json
{
  "name": "Conference Room B",
  "type": "MEETING_ROOM",
  "category": "Meeting Space",
  "description": "Large conference room with video conferencing setup",
  "capacity": 30,
  "location": "Building B, Floor 1",
  "availableFrom": "09:00",
  "availableTo": "18:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/conference-room.jpg"
}
```

**Request Body - Sample 3: Library**:
```json
{
  "name": "Central Library",
  "type": "LIBRARY",
  "category": "Study Space",
  "description": "University central library with extensive collection",
  "capacity": 200,
  "location": "Building C, Floor 1-3",
  "availableFrom": "07:00",
  "availableTo": "22:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/library.jpg"
}
```

**Expected Response (201 Created)**:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Computer Lab A",
  "type": "COMPUTER_LAB",
  "category": "Technology",
  "description": "Modern computer lab with 50 workstations equipped with latest software",
  "capacity": 50,
  "location": "Building A, Floor 2",
  "availableFrom": "08:00",
  "availableTo": "17:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/computer-lab.jpg",
  "createdAt": "2024-01-15T10:30:45",
  "updatedAt": "2024-01-15T10:30:45"
}
```

---

### 2. GET All Resources with Pagination

**Endpoint**: `GET /api/resources?page=0&size=10&sort=id,desc`

**Response (200 OK)**:
```json
{
  "content": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Computer Lab A",
      "type": "COMPUTER_LAB",
      "category": "Technology",
      "description": "Modern computer lab with 50 workstations equipped with latest software",
      "capacity": 50,
      "location": "Building A, Floor 2",
      "availableFrom": "08:00",
      "availableTo": "17:00",
      "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
      "status": "AVAILABLE",
      "imageUrl": "https://example.com/computer-lab.jpg",
      "createdAt": "2024-01-15T10:30:45",
      "updatedAt": "2024-01-15T10:30:45"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Conference Room B",
      "type": "MEETING_ROOM",
      "category": "Meeting Space",
      "description": "Large conference room with video conferencing setup",
      "capacity": 30,
      "location": "Building B, Floor 1",
      "availableFrom": "09:00",
      "availableTo": "18:00",
      "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
      "status": "AVAILABLE",
      "imageUrl": "https://example.com/conference-room.jpg",
      "createdAt": "2024-01-15T11:15:30",
      "updatedAt": "2024-01-15T11:15:30"
    }
  ],
  "pageable": {
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "offset": 0,
    "pageNumber": 0,
    "pageSize": 10,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 1,
  "totalElements": 2,
  "last": true,
  "size": 10,
  "number": 0,
  "sort": {
    "empty": false,
    "sorted": true,
    "unsorted": false
  },
  "numberOfElements": 2,
  "first": true,
  "empty": false
}
```

---

### 3. GET Resource by ID

**Endpoint**: `GET /api/resources/507f1f77bcf86cd799439011`

**Response (200 OK)**:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Computer Lab A",
  "type": "COMPUTER_LAB",
  "category": "Technology",
  "description": "Modern computer lab with 50 workstations equipped with latest software",
  "capacity": 50,
  "location": "Building A, Floor 2",
  "availableFrom": "08:00",
  "availableTo": "17:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/computer-lab.jpg",
  "createdAt": "2024-01-15T10:30:45",
  "updatedAt": "2024-01-15T10:30:45"
}
```

**Response (404 Not Found)**:
```json
{
  "timestamp": "2024-01-15T10:35:20",
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found with id: 507f1f77bcf86cd799439999",
  "path": "/api/resources/507f1f77bcf86cd799439999"
}
```

---

### 4. UPDATE Resource (PUT)

**Endpoint**: `PUT /api/resources/507f1f77bcf86cd799439011`

**Request Body**:
```json
{
  "name": "Computer Lab A - Updated",
  "type": "COMPUTER_LAB",
  "category": "Technology",
  "description": "Modern computer lab with 60 workstations equipped with latest software - UPDATED",
  "capacity": 60,
  "location": "Building A, Floor 2",
  "availableFrom": "08:00",
  "availableTo": "19:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/computer-lab-updated.jpg"
}
```

**Response (200 OK)**:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Computer Lab A - Updated",
  "type": "COMPUTER_LAB",
  "category": "Technology",
  "description": "Modern computer lab with 60 workstations equipped with latest software - UPDATED",
  "capacity": 60,
  "location": "Building A, Floor 2",
  "availableFrom": "08:00",
  "availableTo": "19:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/computer-lab-updated.jpg",
  "createdAt": "2024-01-15T10:30:45",
  "updatedAt": "2024-01-15T11:45:30"
}
```

---

### 5. DELETE Resource

**Endpoint**: `DELETE /api/resources/507f1f77bcf86cd799439011`

**Response (204 No Content)**:
```
(Empty response body)
```

---

### 6. SEARCH Resources by Keyword

**Endpoint**: `GET /api/resources/search/keyword?keyword=lab&page=0&size=10`

**Response (200 OK)**:
```json
{
  "content": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Computer Lab A",
      "type": "COMPUTER_LAB",
      "category": "Technology",
      "description": "Modern computer lab with 50 workstations equipped with latest software",
      "capacity": 50,
      "location": "Building A, Floor 2",
      "availableFrom": "08:00",
      "availableTo": "17:00",
      "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
      "status": "AVAILABLE",
      "imageUrl": "https://example.com/computer-lab.jpg",
      "createdAt": "2024-01-15T10:30:45",
      "updatedAt": "2024-01-15T10:30:45"
    }
  ],
  "pageable": {
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "offset": 0,
    "pageNumber": 0,
    "pageSize": 10,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 1,
  "totalElements": 1,
  "last": true,
  "size": 10,
  "number": 0,
  "sort": {
    "empty": false,
    "sorted": true,
    "unsorted": false
  },
  "numberOfElements": 1,
  "first": true,
  "empty": false
}
```

---

### 7. FILTER Resources by Type

**Endpoint**: `GET /api/resources/filter/type?type=COMPUTER_LAB&page=0&size=10`

**Response (200 OK)**:
```json
{
  "content": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Computer Lab A",
      "type": "COMPUTER_LAB",
      "capacity": 50,
      "location": "Building A, Floor 2",
      "status": "AVAILABLE",
      "createdAt": "2024-01-15T10:30:45",
      "updatedAt": "2024-01-15T10:30:45"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10
  },
  "totalPages": 1,
  "totalElements": 1,
  "empty": false
}
```

---

### 8. FILTER Resources by Status

**Endpoint**: `GET /api/resources/filter/status?status=AVAILABLE&page=0&size=10`

**Response (200 OK - Returns all AVAILABLE resources)**

---

### 9. FILTER Resources by Capacity

**Endpoint**: `GET /api/resources/filter/capacity?minCapacity=30&page=0&size=10`

**Response (200 OK - Returns resources with capacity >= 30)**

---

### 10. FILTER Resources by Location

**Endpoint**: `GET /api/resources/filter/location?location=Building%20A&page=0&size=10`

**Response (200 OK - Returns resources in "Building A")**

---

## MongoDB Query Examples

### View Collections in MongoDB Shell
```bash
mongo

# Switch to facilitiesdb
use facilitiesdb

# List all resources
db.resources.find()

# Pretty print
db.resources.find().pretty()

# Count resources
db.resources.count()

# Find resources by type
db.resources.find({ "type": "COMPUTER_LAB" })

# Find resources by capacity greater than 40
db.resources.find({ "capacity": { $gt: 40 } })

# Find resources by location with regex
db.resources.find({ "location": { $regex: "Building A", $options: "i" } })

# Find resources with status AVAILABLE
db.resources.find({ "status": "AVAILABLE" })
```

---

## Error Testing Scenarios

### 1. Validation Error - Missing Required Fields

**Request**:
```json
{
  "name": "",
  "type": "COMPUTER_LAB",
  "capacity": -5
}
```

**Response (400 Bad Request)**:
```json
{
  "timestamp": "2024-01-15T10:45:30",
  "status": 400,
  "error": "Bad Request",
  "message": "Resource name must not be empty",
  "path": "/api/resources"
}
```

### 2. Duplicate Resource Name

**Request** (after creating "Computer Lab A"):
```json
{
  "name": "Computer Lab A",
  "type": "COMPUTER_LAB",
  "capacity": 50,
  "location": "Different Building"
}
```

**Response (400 Bad Request)**:
```json
{
  "timestamp": "2024-01-15T10:50:15",
  "status": 400,
  "error": "Bad Request",
  "message": "Resource with name 'Computer Lab A' already exists",
  "path": "/api/resources"
}
```

### 3. Invalid Time Range

**Request**:
```json
{
  "name": "Test Lab",
  "type": "COMPUTER_LAB",
  "capacity": 30,
  "location": "Building A",
  "availableFrom": "17:00",
  "availableTo": "08:00"
}
```

**Response (400 Bad Request)**:
```json
{
  "timestamp": "2024-01-15T10:55:45",
  "status": 400,
  "error": "Bad Request",
  "message": "availableFrom must be before availableTo (format: HH:mm)",
  "path": "/api/resources"
}
```

### 4. Resource Not Found

**Request**:
```
GET /api/resources/invalidid123
```

**Response (404 Not Found)**:
```json
{
  "timestamp": "2024-01-15T11:00:20",
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found with id: invalidid123",
  "path": "/api/resources/invalidid123"
}
```

---

## Postman Collection

### Import URLs:
1. **Create**: `POST http://localhost:8080/api/resources`
2. **Get All**: `GET http://localhost:8080/api/resources?page=0&size=10`
3. **Get By ID**: `GET http://localhost:8080/api/resources/{id}`
4. **Update**: `PUT http://localhost:8080/api/resources/{id}`
5. **Delete**: `DELETE http://localhost:8080/api/resources/{id}`
6. **Search**: `GET http://localhost:8080/api/resources/search/keyword?keyword=lab`
7. **Filter by Type**: `GET http://localhost:8080/api/resources/filter/type?type=COMPUTER_LAB`
8. **Filter by Status**: `GET http://localhost:8080/api/resources/filter/status?status=AVAILABLE`
9. **Filter by Capacity**: `GET http://localhost:8080/api/resources/filter/capacity?minCapacity=30`
10. **Filter by Location**: `GET http://localhost:8080/api/resources/filter/location?location=Building%20A`

---

## Key Changes from H2/JPA to MongoDB

| Aspect | H2/JPA | MongoDB |
|--------|--------|---------|
| **ID Type** | Long (auto-generated) | String (MongoDB ObjectId) |
| **Entity Annotation** | @Entity | @Document |
| **Repository** | JpaRepository | MongoRepository |
| **Query Language** | JPQL | MongoDB Query Language |
| **Database** | H2 (file/memory) | MongoDB (NoSQL) |
| **Transactions** | Full ACID | Limited (single document) |
| **Schema** | Rigid (DDL) | Flexible (dynamic) |

---

## Verification Checklist

- [ ] MongoDB is running on localhost:27017
- [ ] Application starts without errors
- [ ] `POST /api/resources` creates new resources with String IDs
- [ ] `GET /api/resources` retrieves paginated results
- [ ] `GET /api/resources/{id}` retrieves single resource by ObjectId
- [ ] `PUT /api/resources/{id}` updates resource and updates timestamp
- [ ] `DELETE /api/resources/{id}` deletes resource
- [ ] Search functionality works with regex matching
- [ ] All filters return correct paginated results
- [ ] Validation errors are properly caught and returned
- [ ] MongoDB database contains 'facilitiesdb' with 'resources' collection
- [ ] All fields are correctly mapped to MongoDB documents
- [ ] Available days are stored as array in MongoDB
- [ ] Timestamps are properly recorded for all operations

---

## Troubleshooting

### MongoDB Connection Issues
```
Error: Unable to connect to MongoDB
Solution: Ensure MongoDB is running on port 27017
Command: mongod
```

### Entity Mapping Issues
```
Error: Cannot deserialize value of type `com.university.entity.Resource`
Solution: Ensure @Document annotation is present on Resource class
```

### ID Type Mismatch
```
Error: String to Long conversion error
Solution: Verify all ID parameters use String type (not Long)
```

### Missing Indexes
```
Error: Slow query performance
Solution: Enable auto-index creation in application.properties
Property: spring.data.mongodb.auto-index-creation=true
```

---

## Performance Notes

- MongoDB provides faster queries for large datasets
- Indexes are automatically created for ID fields
- Queries use regex for text search (not full-text search)
- Pagination performance remains constant regardless of collection size
- Consider adding database indexes for frequently queried fields
