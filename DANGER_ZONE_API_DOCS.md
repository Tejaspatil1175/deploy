# System Danger Zone API - Documentation

## Overview
The System Danger Zone API provides critical administrative operations for the disaster management system. These operations are designed for system maintenance and emergency data management.

⚠️ **WARNING**: All operations in this API are irreversible and can cause permanent data loss. Always backup data before use.

## Authentication
All endpoints require admin authentication via JWT token:
```
Authorization: Bearer <admin_jwt_token>
```

## API Endpoints

### Base URL
```
http://localhost:4000/api/danger-zone
```

### 1. Get System Statistics
**GET** `/stats`

Returns current system data counts.

**Response:**
```json
{
  "success": true,
  "stats": {
    "disasters": 15,
    "users": 1250,
    "volunteers": 85,
    "locations": 3200,
    "admins": 3,
    "lastUpdated": "2024-01-20T10:30:00.000Z"
  }
}
```

### 2. Export System Data
**GET** `/export`

Exports all system data for backup purposes.

**Response:**
```json
{
  "success": true,
  "message": "Data exported successfully",
  "exportData": {
    "exportDate": "2024-01-20T10:30:00.000Z",
    "data": {
      "disasters": [...],
      "users": [...],
      "volunteers": [...],
      "locations": [...]
    },
    "counts": {
      "disasters": 15,
      "users": 1250,
      "volunteers": 85,
      "locations": 3200
    }
  }
}
```

### 3. Delete Collections
**DELETE** `/disasters` - Delete all disasters
**DELETE** `/users` - Delete all users
**DELETE** `/volunteers` - Delete all volunteers
**DELETE** `/locations` - Delete all user locations

**Response:**
```json
{
  "success": true,
  "message": "Deleted 15 disasters",
  "deletedCount": 15
}
```

### 4. Delete Collection by Type
**DELETE** `/collection/:collectionType`

Parameters:
- `collectionType`: disasters, users, volunteers, locations

**Response:**
```json
{
  "success": true,
  "message": "Deleted 15 disasters",
  "deletedCount": 15,
  "collectionType": "disasters"
}
```

### 5. Complete System Reset
**DELETE** `/reset`

⚠️ **MOST DANGEROUS** - Deletes all data except admin accounts.

**Response:**
```json
{
  "success": true,
  "message": "System reset completed",
  "deletedCounts": {
    "disasters": 15,
    "users": 1250,
    "volunteers": 85,
    "locations": 3200
  }
}
```

## Frontend Integration

### Admin Dashboard Access
Navigate to: `http://localhost:3000/system-danger-zone`

### Features Available:
1. **Real-time Statistics** - View current system data counts
2. **Data Export** - Download complete system backup as JSON
3. **Selective Deletion** - Delete specific data collections
4. **System Reset** - Complete system wipe (except admins)
5. **Confirmation Dialogs** - Double confirmation for all dangerous operations
6. **Operation Logging** - Toast notifications for all operations

### Security Features:
- JWT authentication required
- Double confirmation dialogs
- Real-time statistics before operations
- Automatic data export suggestions
- Color-coded severity indicators

## Usage Examples

### Using cURL:

**Get Statistics:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:4000/api/danger-zone/stats
```

**Export Data:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:4000/api/danger-zone/export
```

**Delete All Users:**
```bash
curl -X DELETE \
     -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:4000/api/danger-zone/users
```

### Using JavaScript:
```javascript
const token = localStorage.getItem('adminToken');

// Get statistics
const stats = await fetch('/api/danger-zone/stats', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Delete collection
const result = await fetch('/api/danger-zone/collection/disasters', {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Error Handling
All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

Common HTTP status codes:
- `200` - Success
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Collection not found
- `500` - Internal server error

## Best Practices

1. **Always backup first** - Use the export endpoint before any destructive operation
2. **Test in development** - Never run dangerous operations on production without testing
3. **Monitor system stats** - Check current data counts before operations
4. **Use confirmation dialogs** - The frontend provides double confirmation for safety
5. **Monitor logs** - Check server logs for operation results
6. **Plan downtime** - Large deletions may temporarily impact system performance

## Files Created/Modified

### Backend:
- `backend/controllers/dangerZoneController.js` - Main API controller
- `backend/routes/dangerZoneRoutes.js` - Route definitions
- `backend/app.js` - Added route integration

### Frontend:
- `admin/src/pages/SystemDangerZone.tsx` - Main danger zone page
- `admin/src/components/AppSidebar.tsx` - Added navigation link
- `admin/src/App.tsx` - Added route definition
- `admin/src/contexts/AuthContext.tsx` - Fixed API URL consistency
- `admin/.env` - Updated API URL to port 5000

## Production Deployment Notes

1. **Environment Variables**: Ensure `VITE_API_URL` points to production backend
2. **Additional Security**: Consider IP whitelisting for danger zone operations
3. **Audit Logging**: Add detailed logging for all dangerous operations
4. **Database Backups**: Implement automatic backups before dangerous operations
5. **Rate Limiting**: Add rate limiting to prevent accidental rapid operations

## Support
For issues or questions about the Danger Zone API, refer to the main application documentation or contact the development team.
