# AlbDev Developer Portal - Implementation Plan

## 🎯 Project Overview
Building a comprehensive developer portal for Albanian developers to share code, showcase projects, collaborate, and build their professional presence.

---

## 📋 PHASE 1: Authentication & User System (PRIORITY: CRITICAL)

### 1.1 Fix OAuth Configuration ✅ FIRST
**Goal:** Update OAuth to use custom domain https://albanian.dev

**Tasks:**
- [ ] Update `oauthBaseRedirectUri` from `albaniandotdev.web.app` to `albanian.dev`
- [ ] Update Firebase hosting custom domain configuration
- [ ] Test OAuth flow with custom domain

**Files to modify:**
- `nuxt.config.ts` - Update redirect URI
- `firebase.json` - Add custom domain config

**Components:** None

---

### 1.2 Complete Base.al OAuth Integration
**Goal:** Full OAuth flow with automatic Firestore user creation

**Tasks:**
- [ ] Handle OAuth callback and token exchange
- [ ] Create/update user in Firestore after OAuth success
- [ ] Store user profile data (email, username, avatar, bio)
- [ ] Link Firebase Auth with Firestore user document
- [ ] Add error handling and loading states

**Firestore Schema - Users Collection:**
```typescript
interface User {
  uid: string              // Firebase Auth UID
  email: string
  username: string         // Unique username
  displayName: string
  avatarUrl?: string
  bio?: string
  location?: string
  website?: string
  githubUsername?: string
  twitterHandle?: string
  reputation: number       // Points from community activity
  roles: string[]          // ['user', 'admin', 'moderator']
  createdAt: string
  updatedAt: string
  lastSeen: string
}
```

**Files to modify:**
- `app/pages/auth/callback.vue` - Complete user creation logic
- `app/composables/useAuth.ts` - Add Firestore user sync
- `firestore.rules` - Already has user rules ✓

**Components:** UCard, UIcon, UButton

---

### 1.3 User Profile Pages
**Goal:** Display user profiles and activity

**Tasks:**
- [ ] Create `/u/[username].vue` profile page
- [ ] Show user posts, comments, reputation
- [ ] Add edit profile functionality
- [ ] Display user's repositories and projects
- [ ] Show activity timeline

**Routes to create:**
- `/u/[username]` - View profile
- `/settings/profile` - Edit own profile
- `/settings/account` - Account settings

**Firestore Collections:**
- Already exists: `users` ✓

**Components:**
- UCard, UAvatar, UBadge, UTabs, UButton, UFormField, UInput, UTextarea

---

### 1.4 Enhanced Auth Middleware
**Goal:** Check both Firebase Auth AND Firestore user exists

**Tasks:**
- [ ] Update middleware to verify Firestore user document
- [ ] Redirect to profile setup if user missing
- [ ] Add role-based access control
- [ ] Create admin middleware

**Files to modify:**
- `app/middleware/auth.ts` - Check Firestore user
- `app/middleware/admin.ts` (new) - Admin-only routes

**Components:** None

---

## 📋 PHASE 2: Code Sharing Features (PRIORITY: HIGH)

### 2.1 Add Code Snippet Post Type
**Goal:** Allow users to share code with syntax highlighting

**Tasks:**
- [ ] Install `@nuxtjs/mdc` or use MDC components for code blocks
- [ ] Add "Code" tab to post submission
- [ ] Support multiple files per code post
- [ ] Add language selector (JS, Python, Go, etc.)
- [ ] Implement syntax highlighting with Shiki
- [ ] Add copy button to code blocks
- [ ] Support code diff view for updates

**Post Type Extension:**
```typescript
interface Post {
  // ... existing fields
  type: 'text' | 'link' | 'image' | 'code' | 'repo' // Add 'code', 'repo'

  // For code posts:
  codeSnippets?: {
    filename: string
    language: string
    code: string
  }[]

  // For repo posts:
  repoUrl?: string
  repoData?: {
    name: string
    description: string
    stars: number
    language: string
    topics: string[]
  }
}
```

**Files to modify:**
- `app/pages/submit.vue` - Add code snippet tab
- `app/components/PostCard.vue` - Display code snippets
- Add: `app/components/CodeBlock.vue` - Syntax highlighted code
- Add: `app/components/CodeEditor.vue` - Code input with highlighting

**Nuxt Modules to install:**
```bash
npm install @nuxtjs/mdc shiki
```

**Components:**
- UCard, UTabs, UButton, UFormField, UInput, USelect, UTextarea, UIcon, UBadge

---

### 2.2 Code Snippet Detail Pages
**Goal:** Full page view for code posts with comments

**Tasks:**
- [ ] Create `/p/[postId].vue` for post detail
- [ ] Show full code with line numbers
- [ ] Add code playground/sandbox integration (optional)
- [ ] Show related posts
- [ ] Add bookmark functionality

**Routes to create:**
- `/p/[postId]` - Post detail page

**Firestore Collections:**
- Use existing: `posts`, `comments` ✓
- Add: `bookmarks` collection

**Components:**
- UCard, UBadge, UButton, UIcon, UTabs, UAvatar, UAlert

---

## 📋 PHASE 3: Repository Integration (PRIORITY: HIGH)

### 3.1 GitHub Repository Posts
**Goal:** Share and showcase GitHub repos

**Tasks:**
- [ ] Add "Repository" post type
- [ ] Input GitHub URL and fetch repo data via API
- [ ] Display repo card with stars, forks, language
- [ ] Show README preview
- [ ] Auto-refresh repo stats daily
- [ ] Support GitLab and other platforms

**Files to create:**
- `app/components/RepoCard.vue` - Repository display card
- `app/composables/useGithub.ts` - GitHub API integration

**External APIs:**
- GitHub REST API: `https://api.github.com/repos/{owner}/{repo}`

**Components:**
- UCard, UBadge, UIcon, UButton, ULink, UAvatar

---

### 3.2 User Repository Showcase
**Goal:** Display user's GitHub repos on profile

**Tasks:**
- [ ] Fetch user's GitHub repos
- [ ] Display on profile page
- [ ] Allow pinning favorite repos
- [ ] Show contribution stats

**Firestore Schema:**
```typescript
interface UserRepos {
  userId: string
  repos: {
    id: string
    name: string
    url: string
    stars: number
    language: string
    isPinned: boolean
  }[]
  lastSynced: string
}
```

**Components:**
- UCard, UBadge, UIcon, UButton, ULink

---

## 📋 PHASE 4: Developer Portfolio (PRIORITY: MEDIUM)

### 4.1 Project Showcase
**Goal:** Users can create portfolio projects

**Tasks:**
- [ ] Create `/projects` section
- [ ] Add project CRUD operations
- [ ] Support images, links, tech stack
- [ ] Display projects on user profile
- [ ] Add tags and categories

**Firestore Schema - Projects Collection:**
```typescript
interface Project {
  id: string
  userId: string
  title: string
  description: string
  longDescription?: string  // Markdown
  imageUrls: string[]
  liveUrl?: string
  repoUrl?: string
  techStack: string[]      // ['Nuxt', 'Firebase', 'TypeScript']
  tags: string[]
  featured: boolean
  createdAt: string
  updatedAt: string
}
```

**Routes to create:**
- `/projects` - Browse all projects
- `/projects/new` - Create project
- `/projects/[id]` - View project
- `/projects/[id]/edit` - Edit project

**Components:**
- UCard, UBadge, UButton, UIcon, UFormField, UInput, UTextarea, UFileUpload

---

### 4.2 Tech Stack & Skills
**Goal:** Users showcase their tech expertise

**Tasks:**
- [ ] Add skills section to profile
- [ ] Skill endorsements from other users
- [ ] Display tech stack badges
- [ ] Show experience level per skill

**Firestore Schema - UserSkills:**
```typescript
interface UserSkills {
  userId: string
  skills: {
    name: string              // 'JavaScript', 'Python'
    level: 'beginner' | 'intermediate' | 'expert'
    endorsements: number
    endorsedBy: string[]      // User IDs
  }[]
}
```

**Components:**
- UBadge, UButton, UCard, UProgress (for skill levels)

---

## 📋 PHASE 5: Community Features (PRIORITY: MEDIUM)

### 5.1 Enhanced Comments System
**Goal:** Rich comment interactions

**Tasks:**
- [ ] Nested replies (already in schema)
- [ ] Code snippets in comments
- [ ] Markdown support
- [ ] Mention users with @username
- [ ] Comment reactions/emojis

**Files to modify:**
- `app/components/CommentCard.vue` (new)
- `app/components/CommentForm.vue` (new)
- `app/pages/p/[postId].vue` - Add comments section

**Components:**
- UCard, UAvatar, UButton, UTextarea, UFormField, UBadge

---

### 5.2 Messaging System
**Goal:** Direct messages between users

**Tasks:**
- [ ] Create messaging interface
- [ ] Real-time message updates
- [ ] Notification system
- [ ] Message threads

**Firestore Collections - Messages:**
```typescript
interface Message {
  id: string
  fromUserId: string
  toUserId: string
  content: string
  isRead: boolean
  createdAt: string
}

interface MessageThread {
  id: string              // userId1_userId2
  participants: string[]
  lastMessage: string
  lastMessageAt: string
  unreadCount: { [userId: string]: number }
}
```

**Routes to create:**
- `/messages` - Message inbox
- `/messages/[threadId]` - Conversation

**Components:**
- UCard, UInput, UButton, UAvatar, UBadge

---

### 5.3 Notifications
**Goal:** Keep users updated on activity

**Tasks:**
- [ ] Comment replies notification
- [ ] Post upvotes notification
- [ ] Mention notifications
- [ ] Follow notifications
- [ ] Real-time updates

**Firestore Collection - Notifications:**
```typescript
interface Notification {
  id: string
  userId: string            // Recipient
  type: 'comment' | 'upvote' | 'mention' | 'follow' | 'reply'
  actorId: string          // Who triggered it
  actorUsername: string
  actorAvatar?: string
  entityType: 'post' | 'comment' | 'user'
  entityId: string
  message: string
  isRead: boolean
  createdAt: string
}
```

**Routes to create:**
- `/notifications` - Notification center

**Components:**
- UCard, UBadge, UButton, UAvatar, UDropdown

---

### 5.4 Following System
**Goal:** Users can follow each other

**Tasks:**
- [ ] Follow/unfollow users
- [ ] Display followers/following count
- [ ] Show followed users' activity feed
- [ ] Follow suggestions

**Firestore Collection - Follows:**
```typescript
interface Follow {
  id: string              // followerId_followingId
  followerId: string
  followingId: string
  createdAt: string
}
```

**Components:**
- UButton, UAvatar, UCard, UBadge

---

## 📋 PHASE 6: Search & Discovery (PRIORITY: MEDIUM)

### 6.1 Advanced Search
**Goal:** Find posts, users, projects easily

**Tasks:**
- [ ] Implement search in header
- [ ] Filter by type (posts, users, projects, repos)
- [ ] Filter by tags, language, community
- [ ] Search autocomplete
- [ ] Recent searches

**Routes to create:**
- `/search` - Search results page

**Components:**
- UInput (with icon), UCard, UBadge, UTabs, UButton, UCommandPalette

---

### 6.2 Trending & Recommendations
**Goal:** Surface popular content

**Tasks:**
- [ ] Trending posts algorithm
- [ ] Trending repositories
- [ ] Featured projects
- [ ] Recommended users to follow

**Routes to create:**
- `/trending` - Trending content
- `/discover` - Discover new content

**Components:**
- UCard, UBadge, UButton, UTabs

---

## 📋 PHASE 7: Additional Features (PRIORITY: LOW)

### 7.1 Job Board
**Goal:** Post and find developer jobs

**Tasks:**
- [ ] Create job posting system
- [ ] Job categories and filters
- [ ] Apply functionality
- [ ] Company profiles

**Firestore Collection - Jobs:**
```typescript
interface Job {
  id: string
  companyName: string
  companyLogo?: string
  title: string
  description: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'remote'
  salary?: { min: number, max: number, currency: string }
  requirements: string[]
  benefits: string[]
  applyUrl?: string
  postedBy: string        // User ID
  isActive: boolean
  createdAt: string
  expiresAt: string
}
```

**Routes to create:**
- `/jobs` - Job listings
- `/jobs/new` - Post a job
- `/jobs/[id]` - Job details

**Components:**
- UCard, UBadge, UButton, UFormField, UInput, UTextarea, USelect

---

### 7.2 Events System
**Goal:** Organize and attend developer events

**Tasks:**
- [ ] Create/browse events
- [ ] RSVP functionality
- [ ] Event calendar
- [ ] Online/in-person events

**Firestore Collection - Events:**
```typescript
interface Event {
  id: string
  title: string
  description: string
  imageUrl?: string
  startDate: string
  endDate: string
  location: string | 'online'
  meetingUrl?: string
  organizerId: string
  attendees: string[]
  maxAttendees?: number
  tags: string[]
  createdAt: string
}
```

**Routes to create:**
- `/events` - Event listings
- `/events/new` - Create event
- `/events/[id]` - Event details

**Components:**
- UCard, UBadge, UButton, UFormField, UInput, UTextarea

---

### 7.3 Learning Resources
**Goal:** Share tutorials and learning materials

**Tasks:**
- [ ] Tutorial posts
- [ ] Video embed support
- [ ] Course recommendations
- [ ] Learning paths

**Routes to create:**
- `/learn` - Learning resources
- `/learn/[slug]` - Tutorial detail

**Components:**
- UCard, UBadge, UButton, UTabs, UAccordion

---

## 🔧 Technical Requirements

### Required NPM Packages:
```bash
# Code highlighting
npm install @nuxtjs/mdc shiki

# Markdown rendering
npm install marked

# Date formatting
npm install date-fns

# GitHub API
# (use fetch - no package needed)
```

### Nuxt UI v4 Components To Use:

**Forms:**
- UFormField, UInput, UTextarea, USelect, UCheckbox, URadioGroup, UButton, UFileUpload

**Display:**
- UCard, UBadge, UAvatar, UAvatarGroup, UIcon, UKbd, UAlert, ULink

**Layout:**
- UContainer, UHeader, UFooter, UTabs, UAccordion, UModal, UDropdown

**Navigation:**
- UBreadcrumb, UNavigationMenu, USidebar

**Content:**
- UTable, UContentSearch, UContentToc, UContentNavigation

### Firestore Security Rules Updates:
Add rules for new collections: `projects`, `userSkills`, `messages`, `messageThreads`, `notifications`, `follows`, `bookmarks`, `jobs`, `events`

---

## 🚀 Implementation Priority Order

1. **Phase 1** (Week 1) - CRITICAL
   - Fix OAuth redirect URI
   - Complete Base.al OAuth + Firestore user creation
   - User profiles
   - Auth middleware

2. **Phase 2** (Week 2) - HIGH PRIORITY
   - Code snippet posts
   - Post detail pages
   - Code syntax highlighting

3. **Phase 3** (Week 3) - HIGH PRIORITY
   - GitHub repository posts
   - Repository showcase on profiles

4. **Phase 4** (Week 4-5) - MEDIUM PRIORITY
   - Project showcase
   - Tech stack & skills

5. **Phase 5** (Week 6-7) - MEDIUM PRIORITY
   - Enhanced comments
   - Notifications
   - Following system

6. **Phase 6** (Week 8) - MEDIUM PRIORITY
   - Search functionality
   - Trending content

7. **Phase 7** (Week 9+) - OPTIONAL
   - Job board
   - Events
   - Learning resources

---

## 📝 Notes

- Use Firestore client-side queries (static site)
- All components should use Nuxt UI v4
- Follow Nuxt 4 `app/` directory structure
- No 404 errors - proper route handling
- Mobile responsive design
- Dark mode support (Nuxt UI default)
- Proper error handling throughout
- Loading states for all async operations
- SEO meta tags for all pages
- Accessibility (ARIA labels)

---

**Next Step:** Start with Phase 1.1 - Update OAuth redirect URI to https://albanian.dev
