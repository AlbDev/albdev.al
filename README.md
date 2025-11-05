# AlbDev - Albanian Developer Community

A Reddit-like platform for Albanian developers built with Nuxt 4, Nuxt UI 4, Firebase, and PostgreSQL.

## Features

- 🔥 **Nuxt 4** - Latest version with enhanced performance
- 🎨 **Nuxt UI 4** - Beautiful, accessible components
- 🔐 **Firebase Authentication** - Secure user authentication
- 💾 **PostgreSQL** - Robust relational database with Drizzle ORM
- 🚀 **Firebase Hosting** - Serverless deployment
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Real-time Features** - Live updates and interactions

## Reddit-like Features

- Create and join communities
- Post text, links, and images
- Upvote/downvote system
- Nested comments
- User profiles with karma
- Community moderation
- Feed sorting (hot, new, top)

## Setup

### Prerequisites

- Node.js 18+ and npm
- Firebase project
- PostgreSQL database (Cloud SQL or other)

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

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Session
SESSION_SECRET=your_session_secret_min_32_chars
```

### Installation

```bash
# Install dependencies
npm install

# Generate database migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

### Database Setup

The project uses Drizzle ORM with PostgreSQL. Run migrations to set up the schema:

```bash
npm run db:push
```

To view your database in Drizzle Studio:

```bash
npm run db:studio
```

## Deployment

### Firebase Deployment

```bash
# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

### Required Firebase Services

1. **Authentication** - Enable Email/Password provider
2. **Cloud Functions** - For server-side rendering
3. **Hosting** - For static assets
4. **Storage** (optional) - For image uploads

### Cloud SQL Setup

1. Create a Cloud SQL PostgreSQL instance
2. Create a database
3. Add connection string to `.env`
4. Run migrations

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
- **Authentication**: Firebase Auth
- **Database**: PostgreSQL with Drizzle ORM
- **Hosting**: Firebase Hosting + Cloud Functions
- **Language**: TypeScript

## License

MIT
