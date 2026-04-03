# Sample JSON Requests for Testing

## 1. Create Laboratory Resource
```json
POST /api/resources HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Authorization: Basic YWRtaW46YWRtaW4xMjM=

{
  "name": "Computer Lab A1",
  "type": "LAB",
  "category": "Computer Science",
  "description": "Advanced computer lab with 40 workstations and modern networking infrastructure",
  "capacity": 40,
  "location": "Building A, Floor 2",
  "availableFrom": "08:00",
  "availableTo": "18:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/images/lab-a1.jpg"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Computer Lab A1",
  "type": "LAB",
  "category": "Computer Science",
  "description": "Advanced computer lab with 40 workstations and modern networking infrastructure",
  "capacity": 40,
  "location": "Building A, Floor 2",
  "availableFrom": "08:00",
  "availableTo": "18:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/images/lab-a1.jpg",
  "createdAt": "2024-03-31T10:30:00",
  "updatedAt": "2024-03-31T10:30:00"
}
```

---

## 2. Create Conference Hall
```json
POST /api/resources HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Authorization: Basic YWRtaW46YWRtaW4xMjM=

{
  "name": "Main Hall",
  "type": "HALL",
  "category": "Auditorium",
  "description": "Large conference hall with audio-visual equipment and seating for 200 people",
  "capacity": 200,
  "location": "Convention Center, Ground Floor",
  "availableFrom": "08:00",
  "availableTo": "22:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/images/main-hall.jpg"
}
```

---

## 3. Create Meeting Room
```json
POST /api/resources HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Authorization: Basic YWRtaW46YWRtaW4xMjM=

{
  "name": "Meeting Room 101",
  "type": "ROOM",
  "category": "Conference",
  "description": "Small meeting room with video conferencing setup",
  "capacity": 10,
  "location": "Building B, Floor 1",
  "availableFrom": "09:00",
  "availableTo": "17:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/images/meeting-room-101.jpg"
}
```

---

## 4. Create Equipment Resource
```json
POST /api/resources HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Authorization: Basic YWRtaW46YWRtaW4xMjM=

{
  "name": "Projector Unit 5",
  "type": "EQUIPMENT",
  "category": "Audio-Visual",
  "description": "High-resolution projector with 5000 lumens brightness",
  "capacity": 1,
  "location": "IT Department Store",
  "availableFrom": "08:00",
  "availableTo": "17:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/images/projector.jpg"
}
```

---

## 5. Update Resource (Increase Capacity)
```json
PUT /api/resources/1 HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Authorization: Basic YWRtaW46YWRtaW4xMjM=

{
  "name": "Computer Lab A1",
  "type": "LAB",
  "category": "Computer Science",
  "description": "Advanced computer lab with 50 workstations and modern networking infrastructure",
  "capacity": 50,
  "location": "Building A, Floor 2",
  "availableFrom": "08:00",
  "availableTo": "20:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/images/lab-a1.jpg"
}
```

---

## 6. Change Resource Status to Maintenance
```json
PUT /api/resources/1 HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Authorization: Basic YWRtaW46YWRtaW4xMjM=

{
  "name": "Computer Lab A1",
  "type": "LAB",
  "category": "Computer Science",
  "description": "Advanced computer lab with 50 workstations and modern networking infrastructure",
  "capacity": 50,
  "location": "Building A, Floor 2",
  "availableFrom": "08:00",
  "availableTo": "20:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
  "status": "MAINTENANCE",
  "imageUrl": "https://example.com/images/lab-a1.jpg"
}
```

---

## 7. Get All Resources with Pagination
```
GET /api/resources?page=0&size=10&sort=name,asc HTTP/1.1
Host: localhost:8080
```

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Computer Lab A1",
      "type": "LAB",
      "category": "Computer Science",
      "description": "Advanced computer lab with 50 workstations and modern networking infrastructure",
      "capacity": 50,
      "location": "Building A, Floor 2",
      "availableFrom": "08:00",
      "availableTo": "20:00",
      "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
      "status": "MAINTENANCE",
      "imageUrl": "https://example.com/images/lab-a1.jpg",
      "createdAt": "2024-03-31T10:30:00",
      "updatedAt": "2024-03-31T11:45:00"
    },
    {
      "id": 2,
      "name": "Main Hall",
      "type": "HALL",
      "category": "Auditorium",
      "description": "Large conference hall with audio-visual equipment and seating for 200 people",
      "capacity": 200,
      "location": "Convention Center, Ground Floor",
      "availableFrom": "08:00",
      "availableTo": "22:00",
      "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
      "status": "AVAILABLE",
      "imageUrl": "https://example.com/images/main-hall.jpg",
      "createdAt": "2024-03-31T10:45:00",
      "updatedAt": "2024-03-31T10:45:00"
    }
  ],
  "totalElements": 4,
  "totalPages": 1,
  "currentPage": 0,
  "pageSize": 10
}
```

---

## 8. Get Single Resource
```
GET /api/resources/1 HTTP/1.1
Host: localhost:8080
```

**Response:**
```json
{
  "id": 1,
  "name": "Computer Lab A1",
  "type": "LAB",
  "category": "Computer Science",
  "description": "Advanced computer lab with 50 workstations and modern networking infrastructure",
  "capacity": 50,
  "location": "Building A, Floor 2",
  "availableFrom": "08:00",
  "availableTo": "20:00",
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
  "status": "MAINTENANCE",
  "imageUrl": "https://example.com/images/lab-a1.jpg",
  "createdAt": "2024-03-31T10:30:00",
  "updatedAt": "2024-03-31T11:45:00"
}
```

---

## 9. Search Resources by Keyword
```
GET /api/resources/search/keyword?keyword=lab&page=0&size=10 HTTP/1.1
Host: localhost:8080
```

---

## 10. Filter Resources by Type
```
GET /api/resources/filter/type?type=LAB&page=0&size=10 HTTP/1.1
Host: localhost:8080
```

---

## 11. Filter Resources by Status
```
GET /api/resources/filter/status?status=AVAILABLE&page=0&size=10 HTTP/1.1
Host: localhost:8080
```

---

## 12. Filter Resources by Location
```
GET /api/resources/filter/location?location=Building%20A&page=0&size=10 HTTP/1.1
Host: localhost:8080
```

---

## 13. Filter Resources by Capacity
```
GET /api/resources/filter/capacity?capacity=50&page=0&size=10 HTTP/1.1
Host: localhost:8080
```

---

## 14. Filter Resources by Type and Capacity
```
GET /api/resources/filter/type-capacity?type=LAB&capacity=30&page=0&size=10 HTTP/1.1
Host: localhost:8080
```

---

## 15. Get Available Resources
```
GET /api/resources/available/list HTTP/1.1
Host: localhost:8080
```

**Response:**
```json
[
  {
    "id": 2,
    "name": "Main Hall",
    "type": "HALL",
    "capacity": 200,
    "location": "Convention Center, Ground Floor",
    "status": "AVAILABLE",
    "createdAt": "2024-03-31T10:45:00",
    "updatedAt": "2024-03-31T10:45:00"
  },
  {
    "id": 3,
    "name": "Meeting Room 101",
    "type": "ROOM",
    "capacity": 10,
    "location": "Building B, Floor 1",
    "status": "AVAILABLE",
    "createdAt": "2024-03-31T11:00:00",
    "updatedAt": "2024-03-31T11:00:00"
  }
]
```

---

## 16. Delete Resource
```
DELETE /api/resources/3 HTTP/1.1
Host: localhost:8080
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

**Response:** 204 No Content

---

## Error Response Examples

### 400 Bad Request - Validation Error
```json
{
  "timestamp": "2024-03-31T10:30:00",
  "status": 400,
  "error": "Validation Failed",
  "errors": {
    "name": "Resource name is required",
    "capacity": "Capacity must be greater than 0",
    "availableFrom": "Start time must be before end time"
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

### 409 Conflict - Duplicate Name
```json
{
  "timestamp": "2024-03-31T10:30:00",
  "status": 400,
  "error": "Validation Error",
  "message": "Resource with name 'Computer Lab A1' already exists",
  "path": "/api/resources"
}
```

---

## cURL Examples

### Create Resource with cURL
```bash
curl -X POST http://localhost:8080/api/resources \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46YWRtaW4xMjM=" \
  -d '{
    "name": "Physics Lab",
    "type": "LAB",
    "category": "Physics",
    "description": "Physics laboratory",
    "capacity": 25,
    "location": "Science Building",
    "availableFrom": "09:00",
    "availableTo": "17:00",
    "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY"],
    "status": "AVAILABLE"
  }'
```

### Get All Resources with cURL
```bash
curl -X GET "http://localhost:8080/api/resources?page=0&size=10"
```

### Update Resource with cURL
```bash
curl -X PUT http://localhost:8080/api/resources/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46YWRtaW4xMjM=" \
  -d '{
    "name": "Physics Lab - Updated",
    "type": "LAB",
    "category": "Physics",
    "description": "Updated physics laboratory",
    "capacity": 30,
    "location": "Science Building, Floor 1",
    "availableFrom": "08:00",
    "availableTo": "18:00",
    "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    "status": "AVAILABLE"
  }'
```

### Delete Resource with cURL
```bash
curl -X DELETE http://localhost:8080/api/resources/1 \
  -H "Authorization: Basic YWRtaW46YWRtaW4xMjM="
```
