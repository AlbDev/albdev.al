# 🔌 Base.al API Integration Guide

This project now uses **Base.al** - a modern Go web framework - as the backend API for authentication and user management. Firestore is still used for posts, comments, and community data.

## 📋 Overview

- **Backend**: Base.al API (Go) running on `localhost:8100`
- **Frontend**: Nuxt 4 + Nuxt UI v4
- **Data Storage**: Firestore (posts, comments, communities)
- **Authentication**: Base.al JWT tokens
- **Database**: SQLite (for Base API - users, profiles)

## 🏗️ Architecture

```
┌─────────────────┐
│  Nuxt Frontend  │
│  (Port 3000)    │
└────────┬────────┘
         │
         ├─────────────┐
         │             │
         ▼             ▼
┌─────────────┐ ┌──────────────┐
│  Base API   │ │  Firestore   │
│ (Port 8100) │ │              │
│             │ │ - Posts      │
│ - Auth      │ │ - Comments   │
│ - Users     │ │ - Communities│
│ - Profiles  │ │              │
└─────────────┘ └──────────────┘
```

## 🚀 Getting Started

### 1. Install Base CLI

The Base CLI is already installed in this project at `~/.base/base`.

To install on your local machine:

```bash
curl -fsSL https://get.base.al | bash
```

### 2. Start the Base API Server

```bash
cd api
~/.base/base start

# Or if Base CLI is in your PATH:
base start
```

The API will start on `http://localhost:8100`.

**Important**: Make sure port 8100 is not in use by another application.

### 3. Start the Nuxt Development Server

In a separate terminal:

```bash
cd ..  # Back to project root
npm run dev
```

The frontend will start on `http://localhost:3000`.

### 4. Test Authentication

1. Navigate to `http://localhost:3000`
2. Click "Sign In" in the header
3. Create a new account or sign in
4. You should be redirected to the home page after successful authentication

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password with token | No |

### Profile Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile/:id` | Get user profile | Yes |
| PUT | `/profile/:id` | Update user profile | Yes |

### Example: Register User

```bash
curl -X POST http://localhost:8100/auth/register \
  -H "Content-Type: application/json" \
  -H "X-API-Key: albdev_api_key_for_frontend_access_12345" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Example: Login User

```bash
curl -X POST http://localhost:8100/auth/login \
  -H "Content-Type: application/json" \
  -H "X-API-Key: albdev_api_key_for_frontend_access_12345" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:

```json
{
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role_id": 1,
    "reputation": 0,
    "created_at": "2025-11-06T00:00:00Z",
    "updated_at": "2025-11-06T00:00:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "exp": 1730937600
}
```

## 🔐 Authentication Flow

### Registration Flow

1. User submits registration form
2. Frontend calls `useBaseApi().register()`
3. Base API creates user in SQLite database
4. Base API returns JWT token + user data
5. Frontend stores token in `localStorage` as `base_access_token`
6. Frontend stores user data in `localStorage` as `base_user`
7. User is redirected to home page

### Login Flow

1. User submits login form
2. Frontend calls `useBaseApi().login()`
3. Base API validates credentials
4. Base API returns JWT token + user data
5. Frontend stores token and user data in `localStorage`
6. User is redirected to home page

### Authenticated Requests

All authenticated requests must include:

```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'X-API-Key': 'albdev_api_key_for_frontend_access_12345'
}
```

## 🛠️ Development

### Base API Configuration

The Base API is configured in `api/.env`:

```env
# Server
SERVER_ADDRESS=localhost
SERVER_PORT=8100

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://albanian.dev

# JWT
JWT_SECRET=albdev_super_secret_jwt_key_change_in_production_12345

# API Key
API_KEY=albdev_api_key_for_frontend_access_12345

# Database
DB_DRIVER=sqlite
DB_PATH=storage/base.db
```

### Nuxt Configuration

The frontend is configured in `nuxt.config.ts`:

```typescript
runtimeConfig: {
  public: {
    baseApiUrl: process.env.BASE_API_URL || 'http://localhost:8100',
    baseApiKey: process.env.BASE_API_KEY || 'albdev_api_key_for_frontend_access_12345',
  }
}
```

### Using Base API in Components

```vue
<script setup lang="ts">
const { register, login, logout } = useBaseApi()

const handleLogin = async () => {
  try {
    const response = await login({
      email: 'john@example.com',
      password: 'password123'
    })
    console.log('Logged in:', response)
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>
```

### Using Auth State

```vue
<script setup lang="ts">
const { user, authToken } = useAuth()

// Check if user is logged in
const isLoggedIn = computed(() => !!user.value)

// Get user data
const username = computed(() => user.value?.username)
const displayName = computed(() => user.value?.displayName)
</script>
```

## 📝 Composables

### `useBaseApi()`

Low-level API client for making requests to Base API.

**Methods:**
- `register(data)` - Register new user
- `login(data)` - Login user
- `logout()` - Logout user
- `forgotPassword(email)` - Request password reset
- `resetPassword(email, token, newPassword)` - Reset password
- `getProfile(userId)` - Get user profile
- `updateProfile(userId, data)` - Update user profile
- `apiRequest(endpoint, options)` - Make authenticated API request

### `useAuth()`

High-level authentication composable that wraps `useBaseApi()`.

**State:**
- `user` - Current user data (readonly)
- `authToken` - Current JWT token (readonly)

**Methods:**
- `signIn(email, password)` - Login user
- `signUp(data)` - Register user
- `signOut()` - Logout user
- `initAuth()` - Initialize auth state

## 🔄 Migration from Firebase Auth

The project has been migrated from Firebase Authentication to Base.al API:

### What Changed

- ✅ Authentication moved to Base.al API
- ✅ User data stored in SQLite (via Base API)
- ✅ JWT tokens instead of Firebase tokens
- ✅ New user fields: `first_name`, `last_name`, `role_id`
- ✅ Firestore still used for posts/comments/communities

### What Stayed the Same

- ✅ Firestore for content data
- ✅ Frontend component structure
- ✅ OAuth flow (coming soon via Base API)
- ✅ User interface and UX

## 🚢 Production Deployment

### 1. Deploy Base API

The Base API should be deployed to a server or cloud platform:

**Option A: VPS (DigitalOcean, Linode, etc.)**

```bash
# On your server
git clone <your-repo>
cd api

# Build the binary
go build -o base-api main.go

# Run with production settings
ENV=production ./base-api
```

**Option B: Docker**

```bash
cd api
docker build -t albdev-api .
docker run -p 8100:8100 -e ENV=production albdev-api
```

### 2. Update Environment Variables

Update `.env` on your server:

```env
ENV=production
SERVER_ADDRESS=0.0.0.0
SERVER_PORT=8100
APPHOST=https://api.albanian.dev

# IMPORTANT: Change these in production!
JWT_SECRET=<generate-strong-secret>
API_KEY=<generate-strong-api-key>

# Use PostgreSQL in production (recommended)
DB_DRIVER=postgres
DB_URL=postgres://user:password@host:5432/database
```

### 3. Update Nuxt Configuration

Set production Base API URL:

```bash
# On your local machine before deployment
export BASE_API_URL=https://api.albanian.dev
export BASE_API_KEY=<your-production-api-key>

npm run deploy
```

Or update `nuxt.config.ts`:

```typescript
public: {
  baseApiUrl: 'https://api.albanian.dev',
  baseApiKey: '<your-production-api-key>',
}
```

### 4. CORS Configuration

Update CORS in `api/.env`:

```env
CORS_ALLOWED_ORIGINS=https://albanian.dev,https://www.albanian.dev
```

## 🐛 Troubleshooting

### API Won't Start

**Problem**: `Error running application: exit status 1`

**Solutions**:
1. Check if port 8100 is already in use: `lsof -i :8100`
2. Check the error logs in `api/logs/`
3. Verify Go is installed: `go version`
4. Try running `go mod tidy` in the api directory

### Network Issues

**Problem**: Frontend can't connect to API

**Solutions**:
1. Verify API is running: `curl http://localhost:8100/health`
2. Check CORS settings in `api/.env`
3. Check browser console for CORS errors
4. Ensure `baseApiUrl` is correct in `nuxt.config.ts`

### Authentication Not Working

**Problem**: Login/Register returns 401 or 403

**Solutions**:
1. Check API key is correct in both `api/.env` and `nuxt.config.ts`
2. Verify JWT secret is set in `api/.env`
3. Check middleware settings in `api/.env`:
   ```env
   MIDDLEWARE_AUTH_ENABLED=true
   MIDDLEWARE_API_KEY_ENABLED=true
   ```
4. Clear localStorage and try again

### Database Issues

**Problem**: User creation fails

**Solutions**:
1. Check if `api/storage/base.db` exists
2. Delete database and restart API to recreate tables
3. Check Base API logs for migration errors

## 📚 Additional Resources

- [Base.al Documentation](https://base.al)
- [Base CLI Documentation](https://base.al/docs/cli)
- [Base Framework GitHub](https://github.com/base-go)
- [MCP Server](https://mcp.base.al)

## 🤝 Contributing

When contributing to the Base API integration:

1. Never commit `.env` files
2. Update this documentation if you add new endpoints
3. Test both registration and login flows
4. Ensure backward compatibility with existing Firestore data

## 📞 Support

For Base.al specific issues, check:
- [Base.al Discord](https://discord.gg/base)
- [Base.al GitHub Issues](https://github.com/base-go/cmd/issues)

For project-specific issues, create an issue in this repository.
