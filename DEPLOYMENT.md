# 🚀 DEPLOYMENT GUIDE

## ⚡ Quick Deploy (5 minutes)

On your LOCAL machine:

```bash
# 1. Pull latest code
git pull origin claude/nuxt4-ui-firebase-setup-011CUqZEZEx1ZMKWjMwKBmSu

# 2. Install dependencies (if not already)
npm install

# 3. Build
npm run build

# 4. Deploy to Firebase
npm run deploy

# 5. Seed communities (AFTER enabling Firestore - see step below)
npm run seed
```

That's it! Your site will be live at: https://albaniandotdev.web.app

**⚠️ IMPORTANT:** Follow the post-deployment steps below to enable Firestore and Authentication!

---

## ⚠️ CRITICAL POST-DEPLOYMENT STEPS

### 1. Enable Firestore (Takes 5-10 minutes)

**You MUST do this or nothing will work!**

1. Go to: https://console.firebase.google.com
2. Select project: **albaniandotdev**
3. Click: **Build** → **Firestore Database**
4. Click: **Create Database**
5. Select: **Start in production mode**
6. Choose region: **us-central1** (or europe-west1 for Albania)
7. Click: **Enable**
8. ⏰ **WAIT** 5-10 minutes for indexes to build

**Check indexes status:**
- Go to: Firestore → Indexes tab
- All should show: ✅ **Enabled** (not "Building...")

---

### 2. Enable Email/Password Authentication

1. Firebase Console → **Authentication**
2. Click: **Get Started** (if first time)
3. **Sign-in method** tab
4. Click: **Email/Password**
5. Toggle: **Enable**
6. Click: **Save**

---

### 3. Seed Communities (REQUIRED!)

**Users cannot create posts without communities!**

**Option A - Automatic Seeding (RECOMMENDED):**

Run this command on your local machine:

```bash
npm run seed
```

This will automatically create 12 communities:
- General Discussion
- JavaScript
- Python
- Go
- Rust
- Mobile Development
- DevOps & Cloud
- Project Showcase
- Jobs & Opportunities
- Events & Meetups
- Albania Tech Scene
- Help & Support

The script is smart - it won't create duplicates if you run it multiple times.

---

**Option B - Manual (Firebase Console):**

If you prefer to create communities manually:

1. Firestore Database → **Start collection**
2. Collection ID: `communities`
3. Click: **Add document**
4. Use **Auto-ID**
5. Add these fields:

```javascript
{
  name: "general",
  displayName: "General Discussion",
  description: "General developer discussions",
  creatorId: "system",
  memberCount: 1,
  isDeleted: false,
  createdAt: "2025-01-06T00:00:00.000Z",
  updatedAt: "2025-01-06T00:00:00.000Z"
}
```

6. **Repeat** for these communities:

| name | displayName | description |
|------|-------------|-------------|
| `javascript` | JavaScript | JavaScript, TypeScript, Node.js |
| `python` | Python | Python programming |
| `showcase` | Project Showcase | Show off your projects! |
| `jobs` | Jobs | Job postings |
| `events` | Events | Developer events |
| `albania` | Albania Tech | Albanian tech scene |

---

## 🔐 Base.al OAuth Setup (Optional but Recommended)

### Get OAuth Credentials

1. **Contact Base.al** or visit their developer portal
2. **Register app:**
   - **Name:** AlbDev Developer Portal
   - **Redirect URI:** `https://albanian.dev/auth/callback`
   - **Scopes:** `openid profile email`
3. **Copy** your Client ID

### Update Config

1. Open: `nuxt.config.ts`
2. Find line 29:
   ```typescript
   oauthBaseClientId: 'albdev_client_id', // TODO: Replace
   ```
3. Replace with:
   ```typescript
   oauthBaseClientId: 'YOUR_ACTUAL_CLIENT_ID',
   ```
4. **Rebuild and redeploy:**
   ```bash
   npm run build
   npm run deploy
   ```

---

## 🌐 Custom Domain Setup

### Add albanian.dev

1. Firebase Console → **Hosting**
2. **Add custom domain**
3. Enter: `albanian.dev`
4. Follow instructions to add DNS records

### DNS Configuration

Add these records in your DNS provider (e.g., Cloudflare, Namecheap):

```
Type: A
Name: @
Value: 151.101.1.195
Value: 151.101.65.195
```

```
Type: A
Name: www
Value: 151.101.1.195
Value: 151.101.65.195
```

**Note:** Firebase will show exact IP addresses in console. Use those!

⏰ **Wait up to 24 hours** for:
- DNS propagation
- SSL certificate provisioning

---

## ✅ Testing Checklist

Visit your site: https://albaniandotdev.web.app

### Phase 1: Basic Functionality
- [ ] Site loads
- [ ] No console errors
- [ ] Homepage shows (even if empty)
- [ ] Header navigation works
- [ ] Dark mode toggle works

### Phase 2: Authentication
- [ ] Click "Sign Up"
- [ ] Create account with email/password
- [ ] Verify you can sign in
- [ ] Sign out
- [ ] Sign in again
- [ ] Profile dropdown shows your info

### Phase 3: Communities
- [ ] Go to "Create Post"
- [ ] See communities in dropdown
- [ ] If empty → Go seed communities!

### Phase 4: Create Content
- [ ] Create **Text Post**
- [ ] Create **Code Snippet** (try JavaScript)
- [ ] Create **Link Post**
- [ ] Share **GitHub Repo** (try: https://github.com/nuxt/nuxt)
- [ ] View post detail page
- [ ] Add comment
- [ ] Upvote/downvote

### Phase 5: Profile
- [ ] Click your username
- [ ] View your profile
- [ ] Click "Edit Profile"
- [ ] Update bio
- [ ] Save changes
- [ ] Verify changes appear

### Phase 6: Discovery
- [ ] Click "Trending"
- [ ] Click "Search"
- [ ] Try searching for a post
- [ ] Browse "Projects"
- [ ] Browse "Jobs"
- [ ] Browse "Events"

---

## 🐛 Troubleshooting

### "No communities available"
**Cause:** Communities collection is empty
**Fix:** Seed communities (see step 3 above)

### "Permission denied" in console
**Cause:** Firestore not enabled or indexes still building
**Fix:**
1. Enable Firestore (step 1)
2. Wait for indexes (check Indexes tab)
3. Redeploy rules: `firebase deploy --only firestore`

### "Failed to create post"
**Cause:** User not authenticated or no communities
**Fix:**
1. Sign in first
2. Seed communities
3. Check console for errors

### OAuth redirect error
**Cause:** Invalid Base.al client ID
**Fix:** Get real client ID and update config

### 404 on routes
**Cause:** Firebase hosting misconfiguration
**Fix:** Check `firebase.json` has correct rewrites (it should!)

### Site not updating after deploy
**Cause:** Browser cache
**Fix:** Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

---

## 📊 Verify Deployment

### Check Firestore
1. Firebase Console → Firestore Database
2. Should see collections: `communities`, `users`, `posts`, etc.

### Check Hosting
1. Firebase Console → Hosting
2. Should show: ✅ **Deployed**
3. Click URL to visit site

### Check Authentication
1. Firebase Console → Authentication
2. After first signup, should see: Users tab with 1 user

---

## 🔄 Future Deployments

Every time you make changes:

```bash
git pull                          # Get latest changes
npm install                       # If package.json changed
npm run build                     # Build
npm run deploy                    # Deploy
```

Or just:
```bash
npm run deploy                    # Builds + deploys
```

---

## 💡 Pro Tips

1. **Enable Analytics:**
   - Firebase Console → Analytics
   - Track user behavior

2. **Set up Backups:**
   - Firebase Console → Firestore → Backups
   - Enable automated backups

3. **Monitor Performance:**
   - Firebase Console → Performance
   - Track load times

4. **Check Logs:**
   - Firebase Console → Functions → Logs
   - Monitor errors

5. **Add Team Members:**
   - Firebase Console → Settings → Users and permissions
   - Invite collaborators

---

## 📈 Next Steps After Deployment

1. **Seed more data:**
   - Add more communities
   - Create sample posts
   - Invite beta users

2. **Customize branding:**
   - Update logo in header
   - Add favicon
   - Customize meta tags

3. **SEO optimization:**
   - Add sitemap
   - Update meta descriptions
   - Submit to Google Search Console

4. **Marketing:**
   - Announce on social media
   - Share in Albanian developer communities
   - Get feedback

5. **Monitor & iterate:**
   - Watch analytics
   - Fix bugs
   - Add requested features

---

## 🆘 Need Help?

1. Check Firebase Console for errors
2. Check browser console (F12) for JavaScript errors
3. Review Firestore rules
4. Check indexes status
5. Verify authentication is enabled

---

**Happy deploying! 🚀🇦🇱**
