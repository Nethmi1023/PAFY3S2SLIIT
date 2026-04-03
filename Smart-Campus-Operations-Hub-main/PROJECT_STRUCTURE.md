# Project Directory Structure

```
paf_sprinboot/
│
├── backend/                                    # Spring Boot Backend
│   ├── pom.xml                                # Maven Configuration
│   └── src/main/
│       ├── java/com/university/
│       │   ├── FacilitiesManagementApplication.java          # Main Spring Boot App
│       │   │
│       │   ├── controller/
│       │   │   └── ResourceController.java                   # 12 REST Endpoints
│       │   │       ├── createResource()      [POST]
│       │   │       ├── getAllResources()     [GET]
│       │   │       ├── getResourceById()     [GET]
│       │   │       ├── updateResource()      [PUT]
│       │   │       ├── deleteResource()      [DELETE]
│       │   │       ├── searchResources()     [GET]
│       │   │       ├── filterByType()        [GET]
│       │   │       ├── filterByStatus()      [GET]
│       │   │       ├── filterByLocation()    [GET]
│       │   │       ├── filterByCapacity()    [GET]
│       │   │       ├── filterByTypeAndCapacity() [GET]
│       │   │       └── getAvailableResources() [GET]
│       │   │
│       │   ├── service/
│       │   │   └── ResourceService.java                      # Service Layer (13 methods)
│       │   │       ├── createResource()
│       │   │       ├── getResourceById()
│       │   │       ├── getAllResources()
│       │   │       ├── getAvailableResources()
│       │   │       ├── updateResource()
│       │   │       ├── deleteResource()
│       │   │       ├── searchResources()
│       │   │       ├── filterByType()
│       │   │       ├── filterByStatus()
│       │   │       ├── filterByLocation()
│       │   │       ├── filterByCapacity()
│       │   │       ├── filterByTypeAndCapacity()
│       │   │       └── Utility methods (mapping, validation)
│       │   │
│       │   ├── repository/
│       │   │   └── ResourceRepository.java                   # Data Access Layer (11 custom queries)
│       │   │       ├── findByType()
│       │   │       ├── findByStatus()
│       │   │       ├── findByLocation()
│       │   │       ├── findByCapacity()
│       │   │       ├── searchResources()
│       │   │       └── Custom JPA queries
│       │   │
│       │   ├── entity/
│       │   │   ├── Resource.java                             # Main Entity (14 fields)
│       │   │   │   ├── id (Long, PK)
│       │   │   │   ├── name (String, required)
│       │   │   │   ├── type (ResourceType enum)
│       │   │   │   ├── category (String)
│       │   │   │   ├── description (Text)
│       │   │   │   ├── capacity (Integer, > 0)
│       │   │   │   ├── location (String)
│       │   │   │   ├── availableFrom (LocalTime)
│       │   │   │   ├── availableTo (LocalTime)
│       │   │   │   ├── availableDays (List<AvailableDay>)
│       │   │   │   ├── status (ResourceStatus enum)
│       │   │   │   ├── imageUrl (String)
│       │   │   │   ├── createdAt (LocalDateTime)
│       │   │   │   └── updatedAt (LocalDateTime)
│       │   │   │
│       │   │   └── enums/
│       │   │       ├── ResourceType.java                     # LAB, HALL, ROOM, EQUIPMENT
│       │   │       ├── AvailableDay.java                     # MONDAY to SUNDAY
│       │   │       └── ResourceStatus.java                   # AVAILABLE, UNAVAILABLE, MAINTENANCE
│       │   │
│       │   ├── dto/
│       │   │   ├── ResourceRequestDTO.java                   # Input Validation DTO
│       │   │   │   └── All required fields with @Valid annotations
│       │   │   │
│       │   │   └── ResourceResponseDTO.java                  # Output Response DTO
│       │   │       └── All entity fields formatted
│       │   │
│       │   ├── exception/
│       │   │   ├── ResourceNotFoundException.java            # 404 Exception
│       │   │   ├── ResourceValidationException.java          # Validation Exception
│       │   │   ├── ErrorResponse.java                        # Standard Error DTO
│       │   │   └── GlobalExceptionHandler.java               # Global exception handling
│       │   │       ├── handleResourceNotFoundException()
│       │   │       ├── handleValidationExceptions()
│       │   │       ├── handleGenericException()
│       │   │       └── handleIllegalArgumentException()
│       │   │
│       │   └── config/
│       │       └── SecurityConfig.java                       # Spring Security Configuration
│       │           ├── HTTP Security setup
│       │           ├── In-memory user storage
│       │           ├── Password encoder (BCrypt)
│       │           ├── Role-based authorization
│       │           └── CORS configuration
│       │
│       └── resources/
│           └── application.properties                        # Spring Boot Configuration
│               ├── Server port: 8080
│               ├── Database: H2 (in-memory)
│               ├── JPA settings
│               ├── Logging configuration
│               └── H2 console enabled
│
├── frontend/                                   # React Frontend
│   ├── package.json                           # NPM Dependencies & Scripts
│   │   ├── react: 18.2.0
│   │   ├── axios: 1.6.0
│   │   ├── react-router-dom: 6.20.0
│   │   ├── bootstrap: 5.3.0
│   │   ├── react-bootstrap: 2.10.0
│   │   └── react-toastify: 10.0.0
│   │
│   ├── public/
│   │   └── index.html                        # HTML Entry Point
│   │
│   └── src/
│       ├── index.js                          # React App Entry
│       │
│       ├── App.jsx                           # Main App Component & Routes
│       │   ├── Router setup
│       │   ├── Routes configuration
│       │   ├── ToastContainer
│       │   └── 5 Routes:
│       │       ├── /login
│       │       ├── /resources
│       │       ├── /resources/add
│       │       ├── /resources/edit/:id
│       │       └── /resources/:id
│       │
│       ├── pages/
│       │   ├── Login.jsx                     # Authentication Page
│       │   │   ├── Username/Password form
│       │   │   ├── Demo credentials display
│       │   │   └── Credentials storage
│       │   │
│       │   ├── ResourceList.jsx              # Resource Management Page
│       │   │   ├── Resources table
│       │   │   ├── Search functionality
│       │   │   ├── Filter by type/status
│       │   │   ├── Pagination controls
│       │   │   ├── CRUD action buttons
│       │   │   ├── Delete confirmation modal
│       │   │   └── Loading states
│       │   │
│       │   └── ResourceDetails.jsx           # Single Resource View
│       │       ├── Full resource information
│       │       ├── Image display
│       │       ├── Badge styling
│       │       ├── Time availability
│       │       ├── Available days list
│       │       └── Edit/Back buttons
│       │
│       ├── components/
│       │   ├── Header.jsx                    # Navigation Component
│       │   │   ├── Logo & branding
│       │   │   ├── Navigation links
│       │   │   ├── User menu
│       │   │   └── Logout functionality
│       │   │
│       │   └── ResourceForm.jsx              # Create/Edit Form Component
│       │       ├── Form fields:
│       │       │   ├── Name
│       │       │   ├── Type (dropdown)
│       │       │   ├── Capacity (number)
│       │       │   ├── Category
│       │       │   ├── Status (dropdown)
│       │       │   ├── Location
│       │       │   ├── Description
│       │       │   ├── Available time range
│       │       │   ├── Available days (checkboxes)
│       │       │   └── Image URL
│       │       ├── Form validation
│       │       ├── Edit mode detection
│       │       ├── Pre-fill logic
│       │       ├── Submit handling
│       │       ├── Loading/submitting states
│       │       └── Navigation on success
│       │
│       ├── services/
│       │   └── api.js                       # API & HTTP Client
│       │       ├── Axios instance setup
│       │       ├── Request interceptors
│       │       ├── Response interceptors
│       │       ├── ResourceAPI methods:
│       │       │   ├── getAllResources()
│       │       │   ├── getResourceById()
│       │       │   ├── createResource()
│       │       │   ├── updateResource()
│       │       │   ├── deleteResource()
│       │       │   ├── searchResources()
│       │       │   ├── filterByType()
│       │       │   ├── filterByStatus()
│       │       │   ├── filterByLocation()
│       │       │   ├── filterByCapacity()
│       │       │   ├── filterByTypeAndCapacity()
│       │       │   └── getAvailableResources()
│       │       └── AuthAPI methods:
│       │           ├── login()
│       │           ├── logout()
│       │           └── isAuthenticated()
│       │
│       └── utils/
│           └── helpers.js                   # Utility Functions
│               ├── validateResource()       # Form validation
│               ├── formatTime()             # Time formatting
│               ├── getEnumDisplay()         # Enum display names
│               ├── convertResourceForDisplay()
│               ├── paginate()               # Array pagination
│               ├── capitalize()             # String capitalization
│               └── formatDate()             # Date formatting
│
├── README.md                                 # Setup & Deployment Guide
│   ├── Project overview
│   ├── Backend setup instructions
│   ├── Frontend setup instructions
│   ├── API endpoints summary
│   ├── Features list
│   ├── Usage examples
│   ├── Testing guide
│   ├── Configuration details
│   ├── Integration notes
│   ├── Database schema
│   ├── Security information
│   ├── Performance considerations
│   ├── Deployment guide
│   ├── Common issues & solutions
│   └── Support resources
│
├── API_DOCUMENTATION.md                     # Complete API Docs
│   ├── Overview & base URL
│   ├── Authentication details
│   ├── 12 Detailed endpoint docs:
│   │   ├── Create resource
│   │   ├── Get all resources
│   │   ├── Get resource by ID
│   │   ├── Update resource
│   │   ├── Delete resource
│   │   ├── Search resources
│   │   ├── Filter by type
│   │   ├── Filter by status
│   │   ├── Filter by location
│   │   ├── Filter by capacity
│   │   ├── Filter by type-capacity
│   │   └── Get available resources
│   ├── Validation rules
│   ├── Error responses
│   ├── Resource types
│   ├── Status enums
│   ├── Available days
│   ├── Integration notes
│   ├── Database schema details
│   ├── Rate limiting info
│   └── CORS configuration
│
├── POSTMAN_COLLECTION.json                  # Postman Collection
│   ├── Base authentication setup
│   └── 10+ Pre-configured requests:
│       ├── Create resource
│       ├── Get all resources
│       ├── Get resource by ID
│       ├── Update resource
│       ├── Delete resource
│       ├── Search resources
│       ├── Filter by type
│       ├── Filter by status
│       ├── Filter by location
│       └── More filter combinations
│
├── SAMPLE_REQUESTS.md                       # Request Examples
│   ├── 16 Complete request examples
│   ├── JSON payloads
│   ├── cURL examples
│   ├── Response examples
│   ├── Error response samples
│   └── Request variations
│
└── IMPLEMENTATION_SUMMARY.md                # This Master Summary
    ├── Project completion status
    ├── Deliverables overview
    ├── Features implemented
    ├── Quick start guide
    ├── API endpoints summary
    ├── Architecture overview
    ├── Database schema
    ├── Security features
    ├── Request/response examples
    ├── Testing checklist
    ├── Dependencies list
    ├── Integration notes
    ├── Documentation references
    ├── Important notes
    ├── Statistics
    ├── Next steps
    ├── Highlights
    └── Completion verification
```

## File Count Summary

| Category | Count | Location |
|----------|-------|----------|
| Backend Java Files | 16 | backend/src/main/java/com/university/ |
| Frontend React Files | 12 | frontend/src/ |
| Configuration Files | 2 | pom.xml, package.json |
| Documentation Files | 4 | .md files |
| Resource Files | 1 | application.properties |
| API Collections | 1 | POSTMAN_COLLECTION.json |
| **Total Project Files** | **36** | |

## Quick Navigation

### For Backend Development
- **Main Application:** `backend/src/main/java/com/university/FacilitiesManagementApplication.java`
- **REST Endpoints:** `backend/src/main/java/com/university/controller/ResourceController.java`
- **Business Logic:** `backend/src/main/java/com/university/service/ResourceService.java`
- **Database Models:** `backend/src/main/java/com/university/entity/Resource.java`
- **Configuration:** `backend/src/main/resources/application.properties`

### For Frontend Development
- **Main App:** `frontend/src/App.jsx`
- **API Calls:** `frontend/src/services/api.js`
- **Pages:** `frontend/src/pages/*.jsx`
- **Components:** `frontend/src/components/*.jsx`
- **Dependencies:** `frontend/package.json`

### For Documentation
- **Setup Guide:** `README.md`
- **API Reference:** `API_DOCUMENTATION.md`
- **Test Requests:** `SAMPLE_REQUESTS.md`
- **Implementation Details:** `IMPLEMENTATION_SUMMARY.md`
- **Postman Import:** `POSTMAN_COLLECTION.json`

## Execution Flow

### Adding a New Resource
```
User Interface (ResourceForm.jsx)
    ↓
Form Validation (helpers.js - validateResource)
    ↓
API Call (api.js - createResource)
    ↓
HTTP Request (axios POST)
    ↓
Backend Controller (ResourceController.java)
    ↓
Service Layer (ResourceService.java - createResource)
    ↓
Validation (GlobalExceptionHandler catches errors)
    ↓
Repository (ResourceRepository.java - save)
    ↓
Database (H2 - INSERT into resources table)
    ↓
Response DTO Mapping
    ↓
HTTP 201 Response
    ↓
Frontend Toast Notification
    ↓
Navigation to Resource List
```

### Viewing Resources
```
ResourceList.jsx (useEffect on mount)
    ↓
api.js (getAllResources with pagination)
    ↓
ResourceController.java (GET /api/resources)
    ↓
ResourceService.java (getAllResources)
    ↓
ResourceRepository.java (findAll with Pageable)
    ↓
Database Query Execution
    ↓
Result Mapping
    ↓
JSON Response
    ↓
Frontend receives Page<ResourceResponseDTO>
    ↓
Table Rendering with Pagination
```

---

**Project Structure Version:** 1.0.0
**Last Updated:** March 31, 2024
**Status:** ✅ COMPLETE
