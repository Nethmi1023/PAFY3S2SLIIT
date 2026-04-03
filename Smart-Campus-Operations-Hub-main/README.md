# Facilities Management System - Complete Setup Guide

## Project Overview
A complete Spring Boot + React web application for managing university facilities and resources.

### Module: Facilities Catalogue / Resource Management
This module manages all facility resources including labs, halls, rooms, and equipment with comprehensive CRUD operations, filtering, and search capabilities.

## Project Structure

```
paf_sprinboot/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/university/
│       ├── FacilitiesManagementApplication.java
│       ├── controller/
│       │   └── ResourceController.java
│       ├── service/
│       │   └── ResourceService.java
│       ├── repository/
│       │   └── ResourceRepository.java
│       ├── entity/
│       │   ├── Resource.java
│       │   └── enums/
│       │       ├── ResourceType.java
│       │       ├── AvailableDay.java
│       │       └── ResourceStatus.java
│       ├── dto/
│       │   ├── ResourceRequestDTO.java
│       │   └── ResourceResponseDTO.java
│       ├── exception/
│       │   ├── ResourceNotFoundException.java
│       │   ├── ResourceValidationException.java
│       │   ├── ErrorResponse.java
│       │   └── GlobalExceptionHandler.java
│       └── config/
│           └── SecurityConfig.java
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── App.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── ResourceList.jsx
│       │   └── ResourceDetails.jsx
│       ├── components/
│       │   ├── Header.jsx
│       │   └── ResourceForm.jsx
│       ├── services/
│       │   └── api.js
│       └── utils/
│           └── helpers.js
├── API_DOCUMENTATION.md
├── POSTMAN_COLLECTION.json
└── README.md (THIS FILE)
```

## Backend Setup

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

### Installation & Running

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Build the project:**
   ```bash
   mvn clean install
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```
   
   Or from IDE: Run `FacilitiesManagementApplication.java`

4. **Verify backend is running:**
   ```
   http://localhost:8080/api
   ```

   H2 Console (development):
   ```
   http://localhost:8080/h2-console
   ```

### Backend Technologies
- **Spring Boot 3.2.0**
- **Spring Data JPA** - Database access layer
- **Spring Security** - Authentication & Authorization
- **Spring Validation** - Input validation
- **H2 Database** - In-memory database (development)
- **Lombok** - Boilerplate code reduction
- **Maven** - Dependency management

### Database Configuration
The application uses H2 in-memory database configured in `application.properties`:

```properties
spring.datasource.url=jdbc:h2:mem:facilitiesdb
spring.jpa.hibernate.ddl-auto=create-drop  # Creates tables on startup
spring.h2.console.enabled=true              # H2 Web Console enabled
```

### Demo Credentials
- **Admin:** username: `admin`, password: `admin123`
- **User:** username: `user`, password: `user123`

## Frontend Setup

### Prerequisites
- Node.js 16+ and npm
- Code Editor (VS Code recommended)

### Installation & Running

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Application will open at:**
   ```
   http://localhost:3000
   ```

### Frontend Technologies
- **React 18.2.0** - UI Framework
- **React Router 6** - Client-side routing
- **Axios** - HTTP Client
- **Bootstrap 5** - UI Styling
- **React-Toastify** - Notifications

## API Endpoints Summary

### Resource Management
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/resources` | Get all resources (paginated) | Public |
| GET | `/api/resources/{id}` | Get resource by ID | Public |
| POST | `/api/resources` | Create new resource | ADMIN |
| PUT | `/api/resources/{id}` | Update resource | ADMIN |
| DELETE | `/api/resources/{id}` | Delete resource | ADMIN |
| GET | `/api/resources/search/keyword` | Search resources | Public |
| GET | `/api/resources/filter/type` | Filter by type | Public |
| GET | `/api/resources/filter/status` | Filter by status | Public |
| GET | `/api/resources/filter/location` | Filter by location | Public |
| GET | `/api/resources/filter/capacity` | Filter by capacity | Public |
| GET | `/api/resources/filter/type-capacity` | Filter by type & capacity | Public |
| GET | `/api/resources/available/list` | Get available resources | Public |

## Features

### Backend Features
✅ Complete CRUD operations for resources
✅ Role-based access control (ADMIN/USER)
✅ Pagination and sorting
✅ Advanced filtering and search
✅ Comprehensive validation
✅ Global exception handling
✅ Request/response DTOs
✅ CORS configuration
✅ Basic Authentication
✅ H2 console for database inspection

### Frontend Features
✅ Resource list with pagination
✅ Add/Edit/Delete resources
✅ Search and filtering
✅ Resource details page
✅ Form validation
✅ Loading states
✅ Error/success notifications
✅ Responsive design
✅ Navigation and routing
✅ Login page

## Usage Examples

### Example 1: Create a Laboratory Resource
```bash
curl -X POST http://localhost:8080/api/resources \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46YWRtaW4xMjM=" \
  -d '{
    "name": "Physics Lab A",
    "type": "LAB",
    "category": "Physical Science",
    "description": "Advanced physics laboratory with scientific equipment",
    "capacity": 30,
    "location": "Science Building, Floor 3",
    "availableFrom": "09:00",
    "availableTo": "17:00",
    "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    "status": "AVAILABLE"
  }'
```

### Example 2: Get Available Resources
```bash
curl -X GET http://localhost:8080/api/resources/available/list
```

### Example 3: Search Resources
```bash
curl -X GET "http://localhost:8080/api/resources/search/keyword?keyword=lab"
```

### Example 4: Filter by Type and Capacity
```bash
curl -X GET "http://localhost:8080/api/resources/filter/type-capacity?type=HALL&capacity=50"
```

## Testing the Application

### Manual Testing
1. **Start Backend:**
   ```bash
   cd backend && mvn spring-boot:run
   ```

2. **Start Frontend:**
   ```bash
   cd frontend && npm start
   ```

3. **Open Frontend:**
   Navigate to `http://localhost:3000`

4. **Login:**
   - Username: `admin`
   - Password: `admin123`

5. **Test Operations:**
   - Create a resource
   - Edit/update a resource
   - Delete a resource
   - Search and filter resources

### API Testing with Postman
1. **Import the Postman collection:**
   - File → Import → Select `POSTMAN_COLLECTION.json`

2. **Set authentication:**
   - Base64 encode: admin:admin123 → YWRtaW46YWRtaW4xMjM=

3. **Test each endpoint**

## Configuration Files

### Backend Configuration (`application.properties`)
- Server port: 8080
- Context path: /api
- Database: H2 in-memory
- H2 console: Enabled at /h2-console

### Frontend Configuration
- API base URL: http://localhost:8080/api
- CORS origins: localhost:3000, localhost:3001

## Common Issues & Solutions

### Issue: Backend won't start
**Solution:** Ensure Java 17+ is installed:
```bash
java -version
```

### Issue: Frontend won't connect to backend
**Solution:** Verify backend is running on port 8080 and check CORS configuration

### Issue: H2 console shows empty database
**Solution:** This is normal on first run. Create resources via API, they'll appear in H2 console

### Issue: npm packages not installing
**Solution:** Clear npm cache and reinstall:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Integration with Booking Module

This module integrates with the booking/reservation module through:

1. **Resource Availability Check:**
   - Use `GET /api/resources/available/list` to fetch available resources for booking

2. **Capacity Validation:**
   - Check `capacity` field before creating bookings
   - Ensure booking party size ≤ resource capacity

3. **Time Slot Validation:**
   - Use `availableFrom` and `availableTo` for time slot availability
   - Use `availableDays` to check if resource can be booked on selected day

4. **Status Check:**
   - Only resources with status "AVAILABLE" should be bookable

## Database Schema Details

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

## Security Notes

### Current Implementation
- Basic Authentication
- In-memory user storage (development)
- Role-based access control
- Input validation
- CORS enabled for specified origins

### For Production
Consider implementing:
- JWT tokens instead of Basic Auth
- Database-backed user management
- OAuth2
- HTTPS only
- Rate limiting
- SQL injection prevention
- XSS protection

## Performance Considerations

1. **Pagination:** Default page size is 10, adjustable via query parameters
2. **Indexes:** Add database indexes on frequently queried fields (name, location, type)
3. **Caching:** Consider implementing caching for read-heavy operations
4. **Async Operations:** Use async processing for file uploads in production

## Deployment Guide

### Backend Deployment
1. Build JAR:
   ```bash
   mvn clean package
   ```

2. Deploy to application server or cloud platform:
   ```bash
   java -jar target/facilities-management-1.0.0.jar
   ```

### Frontend Deployment
1. Build production bundle:
   ```bash
   npm run build
   ```

2. Deploy `build/` folder to web server or CDN

## Support & Documentation

- **Full API Documentation:** See `API_DOCUMENTATION.md`
- **Postman Collection:** See `POSTMAN_COLLECTION.json`
- **Spring Boot Documentation:** https://spring.io/projects/spring-boot
- **React Documentation:** https://react.dev

## License
Internal University Project

## Version
1.0.0

## Last Updated
March 31, 2024
