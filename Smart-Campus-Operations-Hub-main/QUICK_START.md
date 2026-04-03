# MongoDB Migration - Quick Start Guide

## What Was Changed?

Your Spring Boot application has been successfully migrated from **H2 Database** to **MongoDB**. This means:

- 🗄️ **Database**: Changed from H2 (in-memory) → MongoDB (NoSQL)
- 🔑 **IDs**: Changed from Long → String (MongoDB ObjectId)
- 🎯 **Storage**: Changed from relational → document-based
- ✅ **APIs**: All REST endpoints remain **exactly the same**

---

## Prerequisites - Install MongoDB

### Option 1: Local MongoDB Installation

**Windows**:
1. Download MongoDB Community from: https://www.mongodb.com/try/download/community
2. Run the installer and follow setup wizard
3. MongoDB runs as a service automatically

**macOS**:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu)**:
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**Verify Installation**:
```bash
mongod --version
```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/atlas/database
2. Create a cluster
3. Get connection string
4. Update `application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/facilitiesdb
   ```

### Option 3: Docker (Easiest)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

## Step 1: Start MongoDB

**Windows (if installed as service)**:
```bash
# Already running - check in Services
# Or manually start:
"C:\Program Files\MongoDB\Server\{version}\bin\mongod.exe"
```

**Manual start (any OS)**:
```bash
mongod
# Should show: "waiting for connections on port 27017"
```

---

## Step 2: Build the Application

```bash
cd backend
mvn clean install
```

**Expected output**:
```
BUILD SUCCESS
Total time: 45s
```

---

## Step 3: Run the Application

```bash
mvn spring-boot:run
```

**Expected output**:
```
2024-01-15 10:30:45 - Facilities Management API started successfully
2024-01-15 10:30:45 - Listening on http://localhost:8080/api
2024-01-15 10:30:45 - Connected to MongoDB: facilitiesdb
```

---

## Step 4: Test the API

### Create a Resource

```bash
curl -X POST http://localhost:8080/api/resources \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Computer Lab A",
    "type": "COMPUTER_LAB",
    "category": "Technology",
    "description": "Modern computer lab with 50 workstations",
    "capacity": 50,
    "location": "Building A, Floor 2",
    "availableFrom": "08:00",
    "availableTo": "17:00",
    "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY"],
    "status": "AVAILABLE"
  }'
```

**Response** (should contain an `id` field with MongoDB ObjectId):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Computer Lab A",
  "type": "COMPUTER_LAB",
  "capacity": 50,
  ...
}
```

### Get All Resources

```bash
curl http://localhost:8080/api/resources
```

### Get Resource by ID

```bash
curl http://localhost:8080/api/resources/507f1f77bcf86cd799439011
```

### More examples in [MONGODB_MIGRATION_TESTING.md](./MONGODB_MIGRATION_TESTING.md)

---

## Verify MongoDB Data

### Using MongoDB Shell

```bash
mongo
use facilitiesdb
db.resources.find().pretty()
```

### Using MongoDB Compass (GUI)

1. Download: https://www.mongodb.com/products/tools/compass
2. Connect to: `mongodb://localhost:27017`
3. Browse `facilitiesdb` → `resources` collection

---

## Common Issues

### ❌ "mongod not recognized"
**Solution**: Add MongoDB to PATH or use full path to mongod executable

### ❌ "Failed to connect to MongoDB"
**Solution**: 
- Ensure MongoDB is running: `mongod`
- Check port 27017 is not blocked
- Verify connection string in `application.properties`

### ❌ "Duplicate key error"
**Solution**: Resource names must be unique, use different name

### ❌ "Class not found: MongoRepository"
**Solution**: Run `mvn clean install` to download MongoDB dependency

### ❌ "Invalid time format"
**Solution**: Use 24-hour format: `"08:00"` not `"8:00 AM"`

---

## Development Workflow

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start application
cd backend
mvn spring-boot:run

# Terminal 3: Test API
curl http://localhost:8080/api/resources
```

---

## What's the Same?

✅ All REST API endpoints work identically  
✅ Request/response formats unchanged  
✅ Validation rules preserved  
✅ Security configuration intact  
✅ Business logic untouched  

---

## What's Different?

| Aspect | Before (H2) | After (MongoDB) |
|--------|-----------|-----------------|
| Database Startup | Automatic | Requires separate MongoDB process |
| ID Type | `123L` | `"507f1f77bcf86cd799439011"` |
| Data Persistence | File-based | Document store |
| Query Language | SQL/JPQL | MongoDB Query DSL |
| Schema | Fixed | Flexible |

---

## Configuration Files

### `application.properties` Changes

**Removed** (no longer needed):
```properties
spring.datasource.url=
spring.jpa.hibernate.ddl-auto=
spring.h2.console.enabled=
```

**Added** (new MongoDB config):
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/facilitiesdb
spring.data.mongodb.auto-index-creation=true
```

---

## Production Deployment

### Using MongoDB Atlas (Recommended)

1. Create cluster on MongoDB Atlas
2. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/facilitiesdb`
3. Update `application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb+srv://user:pass@cluster.mongodb.net/facilitiesdb
   ```
4. Deploy JAR to server

### Using Self-Hosted MongoDB

1. Set up MongoDB on production server
2. Update connection string in `application.properties`
3. Ensure MongoDB is accessible from app server
4. Deploy JAR to server

---

## Monitoring

### Check if MongoDB is Running

```bash
# Check process
ps aux | grep mongod

# Or connect to shell
mongo
```

### View Application Logs

```bash
# If running with mvn
mvn spring-boot:run  # Logs appear in console

# If running JAR
java -jar facilities-management-1.0.0.jar
```

### Check Database Connection

```bash
mongo
use facilitiesdb
db.adminCommand("ping")  # Should return { ok: 1 }
```

---

## Rollback to H2 (if needed)

If you need to revert to H2:

1. Restore from git backup
2. Run: `git checkout backend/pom.xml`
3. Run: `git checkout backend/src/main/resources/application.properties`
4. Revert entity changes if needed
5. Run: `mvn clean install`

---

## Performance Tips

1. **Add Indexes** for frequently searched fields:
   ```javascript
   db.resources.createIndex({"name": 1})
   db.resources.createIndex({"location": 1})
   ```

2. **Use Pagination**: Always paginate results to limit data transferred

3. **Monitor Connections**: Use MongoDB Compass to view active connections

4. **Enable Logging** in development:
   ```properties
   logging.level.org.springframework.data.mongodb=DEBUG
   ```

---

## Next Steps

1. ✅ Install MongoDB
2. ✅ Start MongoDB service
3. ✅ Build project: `mvn clean install`
4. ✅ Run application: `mvn spring-boot:run`
5. ✅ Test endpoints
6. ✅ Deploy to production

---

## Additional Resources

- **Full Testing Guide**: [MONGODB_MIGRATION_TESTING.md](./MONGODB_MIGRATION_TESTING.md)
- **Migration Details**: [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)
- **MongoDB Docs**: https://docs.mongodb.com/
- **Spring Data MongoDB**: https://spring.io/projects/spring-data-mongodb

---

## Support Commands

```bash
# Check MongoDB version
mongod --version

# List databases
mongo
  show databases

# List collections in database
mongo
  use facilitiesdb
  show collections

# Count resources
mongo
  use facilitiesdb
  db.resources.countDocuments()

# Find all resources
mongo
  use facilitiesdb
  db.resources.find().pretty()

# Delete all resources (for testing)
mongo
  use facilitiesdb
  db.resources.deleteMany({})
```

---

**You're all set!** 🚀

Start MongoDB, run the application, and test the APIs. Everything works the same way - just with MongoDB under the hood.

For detailed testing examples and API documentation, see [MONGODB_MIGRATION_TESTING.md](./MONGODB_MIGRATION_TESTING.md).
