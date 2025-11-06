# AlbDev - Albanian Developer Community

A Reddit-like platform for Albanian developers built with Nuxt 4, Nuxt UI 4, and Firebase.

## Features

- 🔥 **Nuxt 4** - Latest version with enhanced performance
- 🎨 **Nuxt UI 4** - Beautiful, accessible components
- 🔐 **Multiple Auth Options** - Firebase Email/Password + Base.al OAuth
- 💾 **Firestore** - Real-time NoSQL database
- 🚀 **Firebase Hosting** - Serverless deployment
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Real-time Features** - Live updates and interactions
- 🔗 **OAuth Integration** - Sign in with Base.al (Albanian OAuth provider)

## Reddit-like Features

- Create and join communities
- Post text, links, and images
- Upvote/downvote system
- Nested comments (coming soon)
- User profiles with karma
- Community moderation
- Feed sorting (hot, new, top)

## Setup

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore enabled
- Base.al OAuth credentials (optional)

### Environment Variables

Create a `.env` file with:

```env
# Firebase Client Config
NUXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NUXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side)
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Base.al OAuth (Optional - for OAuth login)
OAUTH_BASE_CLIENT_ID=your_client_id
OAUTH_BASE_CLIENT_SECRET=your_client_secret
OAUTH_BASE_REDIRECT_URI=your_redirect_uri
NUXT_PUBLIC_OAUTH_BASE_AUTHORIZE_URL=https://accounts.base.al/oauth/authorize
NUXT_PUBLIC_OAUTH_BASE_TOKEN_URL=https://accounts.base.al/oauth/token
NUXT_PUBLIC_OAUTH_BASE_USERINFO_URL=https://accounts.base.al/oauth/userinfo
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Firebase Setup

1. **Create Firebase Project** at https://console.firebase.google.com
2. **Enable Firestore** - Go to Firestore Database and create database
3. **Enable Authentication**:
   - Go to Authentication → Sign-in method
   - Enable Email/Password provider
4. **Deploy Firestore Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```
5. **Get Service Account Key**:
   - Go to Project Settings → Service Accounts
   - Generate new private key
   - Add credentials to `.env`

To view your database in Drizzle Studio:

```bash
npm run db:studio
```

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete step-by-step deployment guide.

### Quick Deploy

```bash
# Build and deploy
npm run deploy

# Seed communities (after enabling Firestore)
npm run seed
```

### Required Firebase Services

1. **Firestore Database** - NoSQL database for all data
2. **Authentication** - Email/Password + Base.al OAuth
3. **Hosting** - Static site hosting (FREE tier)

**Note:** This project uses **static site generation** (no Cloud Functions) to stay on Firebase's free tier.

## Project Structure

```
├── components/          # Vue components
├── composables/        # Composable functions
├── layouts/            # App layouts
├── middleware/         # Route middleware
├── pages/              # App pages/routes
├── plugins/            # Nuxt plugins
├── server/             # Server-side code
│   ├── api/           # API endpoints
│   ├── database/      # Database schema
│   ├── middleware/    # Server middleware
│   └── utils/         # Server utilities
├── drizzle.config.ts  # Drizzle ORM config
├── nuxt.config.ts     # Nuxt configuration
└── firebase.json      # Firebase config
```

## Development

```bash
# Run dev server
npm run dev

# Type checking
npm run typecheck

# Lint code
npm run lint

# Generate types
npm run postinstall
```

## Tech Stack

- **Framework**: Nuxt 4
- **UI Library**: Nuxt UI 4 (Tailwind CSS)
- **Authentication**: Firebase Auth + Base.al OAuth
- **Database**: Firestore (Firebase)
- **Hosting**: Firebase Hosting + Cloud Functions
- **Language**: TypeScript

## Authentication

The app supports two authentication methods:

### 1. Firebase Email/Password
Traditional email and password authentication powered by Firebase.

### 2. Base.al OAuth
OAuth integration with [Base.al](https://base.al), the Albanian authentication provider. Users can sign in with their Base.al account.

**OAuth Flow:**
1. User clicks "Continue with Base"
2. Redirected to Base.al authorization page
3. After approval, callback creates/links Firebase account
4. User automatically signed in

## Database Structure (Firestore)

```
users/{userId}
  - email, username, displayName, avatar, bio, karma
  - createdAt, updatedAt

communities/{communityId}
  - name, displayName, description, icon, banner
  - memberCount, creatorId
  - createdAt, updatedAt

posts/{postId}
  - title, content, type, url
  - authorId, communityId
  - upvotes, downvotes, commentCount
  - isDeleted, createdAt, updatedAt

postVotes/{userId}_{postId}
  - userId, postId, value (1 or -1)
  - createdAt

communityMembers/{userId}_{communityId}
  - userId, communityId, role
  - joinedAt
```

## License

MIT
