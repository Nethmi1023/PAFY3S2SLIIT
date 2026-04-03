# ⚡ QUICK REFERENCE CARD

## 🚀 Getting Started (5 minutes)

### Terminal 1 - Start Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
✅ Backend runs on: `http://localhost:8080/api`

### Terminal 2 - Start Frontend  
```bash
cd frontend
npm install
npm start
```
✅ Frontend runs on: `http://localhost:3000`

### Login
- **Admin:** admin / admin123 (has create/edit/delete rights)
- **User:** user / user123 (read-only)

---

## 📋 Core Endpoints Cheat Sheet

| Operation | Endpoint | Method | Auth |
|-----------|----------|--------|------|
| List all | `/api/resources?page=0&size=10` | GET | Public |
| Get one | `/api/resources/1` | GET | Public |
| Create | `/api/resources` | POST | ADMIN |
| Update | `/api/resources/1` | PUT | ADMIN |
| Delete | `/api/resources/1` | DELETE | ADMIN |
| Search | `/api/resources/search/keyword?keyword=lab` | GET | Public |
| By type | `/api/resources/filter/type?type=LAB` | GET | Public |
| By status | `/api/resources/filter/status?status=AVAILABLE` | GET | Public |
| Available | `/api/resources/available/list` | GET | Public |

---

## 🧪 Quick Testing with cURL

### Create Resource
```bash
curl -X POST http://localhost:8080/api/resources \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46YWRtaW4xMjM=" \
  -d '{
    "name":"Lab 1",
    "type":"LAB",
    "capacity":30,
    "location":"Building A",
    "status":"AVAILABLE"
  }'
```

### Get All Resources
```bash
curl http://localhost:8080/api/resources
```

### Get Single Resource
```bash
curl http://localhost:8080/api/resources/1
```

### Search
```bash
curl "http://localhost:8080/api/resources/search/keyword?keyword=lab"
```

---

## 🗂️ Key Files to Know

### Backend
- **Start app:** `FacilitiesManagementApplication.java`
- **Endpoints:** `ResourceController.java` (12 endpoints)
- **Logic:** `ResourceService.java` (13 methods)
- **Database:** `ResourceRepository.java` (11 queries)
- **Model:** `Resource.java` (14 fields)
- **Security:** `SecurityConfig.java` (auth setup)
- **Config:** `application.properties` (server settings)

### Frontend
- **App routes:** `App.jsx`
- **List page:** `ResourceList.jsx`
- **Add/Edit form:** `ResourceForm.jsx`
- **Detail view:** `ResourceDetails.jsx`
- **API calls:** `api.js` (all requests)
- **Helpers:** `helpers.js` (validation, formatting)
- **Navigation:** `Header.jsx`

### Documentation
- **Setup:** `README.md`
- **API Docs:** `API_DOCUMENTATION.md`
- **Examples:** `SAMPLE_REQUESTS.md`
- **Postman:** `POSTMAN_COLLECTION.json`

---

## 🔒 Authentication Header

All write operations (POST, PUT, DELETE) require basic auth:

```
Authorization: Basic base64(username:password)

Admin: YWRtaW46YWRtaW4xMjM=
User:  dXNlcjp1c2VyMTIz
```

---

## 📊 Resource Data Structure

```json
{
  "id": 1,
  "name": "Computer Lab A1",
  "type": "LAB",                    // LAB, HALL, ROOM, EQUIPMENT
  "category": "Computer Science",
  "description": "...",
  "capacity": 40,                   // Must be > 0
  "location": "Building A, Floor 2",
  "availableFrom": "08:00",         // HH:mm format
  "availableTo": "18:00",           // Must be > availableFrom
  "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY"],
  "status": "AVAILABLE",            // AVAILABLE, UNAVAILABLE, MAINTENANCE
  "imageUrl": "https://...",
  "createdAt": "2024-03-31T10:30:00",
  "updatedAt": "2024-03-31T10:30:00"
}
```

---

## ✅ Validation Rules

| Field | Rule |
|-------|------|
| name | Required, not empty |
| type | Required, must be valid enum |
| capacity | Required, must be > 0 |
| availableFrom | Must be before availableTo |
| availableTo | Must be after availableFrom |
| status | Must be valid enum |
| availableDays | Can be empty or array of valid days |

---

## 🎨 Frontend Routes

```
/ → /resources              (Auto redirect)
/login                      (Login page)
/resources                  (List all resources)
/resources/add              (Create form)
/resources/edit/:id         (Edit form)
/resources/:id              (Detail view)
```

---

## 🔧 Common Tasks

### Add New Resource via UI
1. Click "Add New Resource"
2. Fill form
3. Select type, status, available days
4. Click "Create Resource"

### Edit Resource
1. Click "Edit" on any resource row
2. Modify fields
3. Click "Update Resource"

### Delete Resource
1. Click "Delete" on any resource
2. Confirm in modal
3. Resource deleted

### Search Resources
1. Type keyword in search box
2. Click "Search"
3. Results appear

### Filter Resources
1. Select type or status from dropdown
2. Click "Reset Filters" to clear

### Change Page Size
1. Select size from dropdown (5/10/25/50)
2. Pagination adjusts

---

## 📈 API Response Format

### Success (200/201)
```json
{
  "id": 1,
  "name": "Lab 1",
  ...
}
```

### Paginated Success (200)
```json
{
  "content": [...],
  "totalElements": 25,
  "totalPages": 3,
  "currentPage": 0,
  "pageSize": 10
}
```

### Error (4xx/5xx)
```json
{
  "timestamp": "2024-03-31T10:30:00",
  "status": 400,
  "error": "Validation Failed",
  "errors": {
    "capacity": "Capacity must be greater than 0"
  },
  "path": "/api/resources"
}
```

---

## 🧠 Architecture

```
Frontend (React)
    ↓ HTTP(Axios)
Backend (Spring Boot)
    ↓ REST API
Controller Layer
    ↓ Business Logic
Service Layer
    ↓ Data Access
Repository Layer
    ↓ SQL Query
H2 Database
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check Java 17+ installed |
| Frontend can't connect | Verify backend on port 8080 |
| Port already in use | Kill process or change port |
| npm errors | `npm cache clean --force` then `npm install` |
| Login fails | Use demo credentials: admin/admin123 |
| No data showing | Create resources via form or API |
| H2 console empty | Data is in-memory, resets on restart |

---

## 📞 Documentation Links

| Document | Purpose |
|----------|---------|
| `README.md` | Full setup & deployment |
| `API_DOCUMENTATION.md` | All 12 endpoints detailed |
| `SAMPLE_REQUESTS.md` | cURL & JSON examples |
| `POSTMAN_COLLECTION.json` | Import to Postman |
| `PROJECT_STRUCTURE.md` | File organization |
| `IMPLEMENTATION_SUMMARY.md` | Complete overview |

---

## 🚀 Deployment Checklist

- [ ] Backend builds: `mvn clean package`
- [ ] Frontend builds: `npm run build`
- [ ] H2 switched to MySQL (if prod)
- [ ] Security config updated
- [ ] Environment variables set
- [ ] CORS origins updated
- [ ] Database backed up
- [ ] Logging configured
- [ ] API tested with Postman
- [ ] Frontend tested in browser

---

## 💡 Pro Tips

1. **Use Postman:** Import `POSTMAN_COLLECTION.json` for easy testing
2. **Check logs:** Spring Boot logs show SQL queries and errors
3. **Use H2 console:** `localhost:8080/h2-console` to inspect database
4. **Save screenshots:** React DevTools available for troubleshooting
5. **API versioning:** Add `/v1/` prefix for future versions
6. **Pagination:** Always use for large datasets
7. **Caching:** Add Redis layer for frequently accessed resources
8. **Testing:** Write unit tests for services

---

## 📊 Quick Stats

| Metric | Value |
|--------|-------|
| Backend Endpoints | 12 |
| Frontend Pages | 5 |
| Service Methods | 13 |
| Database Tables | 2 |
| Enums | 3 |
| DTOs | 2 |
| Components | 7 |
| Total LOC | 2,500+ |
| Setup Time | 5 min |
| Test Coverage | All endpoints |

---

## 🔗 Integration Points

When integrating with Booking module:

1. **Get available resources**
   ```
   GET /api/resources/available/list
   ```

2. **Check capacity**
   ```javascript
   if (partySize <= resource.capacity) // allowed
   ```

3. **Validate time**
   ```javascript
   if (bookingTime >= resource.availableFrom && 
       bookingTime <= resource.availableTo) // allowed
   ```

4. **Check day**
   ```javascript
   if (resource.availableDays.includes(selectedDay)) // allowed
   ```

---

## ⚡ Last Minute Commands

```bash
# Backend
cd backend && mvn spring-boot:run

# Frontend
cd frontend && npm start

# Build Backend
cd backend && mvn clean package

# Build Frontend
cd frontend && npm run build

# Test API
curl http://localhost:8080/api/resources

# View H2 Console
http://localhost:8080/h2-console
```

---

**Last Updated:** March 31, 2024
**Version:** 1.0.0
**Status:** ✅ Ready for Use
