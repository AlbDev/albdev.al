# GitHub Actions Setup

This workflow automatically deploys to Firebase on every push to main or the development branch.

## Required Secrets

Go to: `https://github.com/AlbDev/albdev.al/settings/secrets/actions`

Add these secrets:

### Firebase Configuration (Public - from Firebase Console)
- `NUXT_PUBLIC_FIREBASE_API_KEY` = `AIzaSyDSeTvW6CbgBjRUfzG734CVuC54pv9iajM`
- `NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = `albaniandotdev.firebaseapp.com`
- `NUXT_PUBLIC_FIREBASE_PROJECT_ID` = `albaniandotdev`
- `NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = `albaniandotdev.firebasestorage.app`
- `NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = `189842779837`
- `NUXT_PUBLIC_FIREBASE_APP_ID` = `1:189842779837:web:38ac2bfc404c52a69bd1d4`

### Firebase Admin (Private - from service-account.json)
- `FIREBASE_PRIVATE_KEY` = The private_key field (including -----BEGIN/END PRIVATE KEY-----)
- `FIREBASE_CLIENT_EMAIL` = `firebase-adminsdk-oyxcx@albaniandotdev.iam.gserviceaccount.com`

### Firebase Service Account (Private - entire JSON)
- `FIREBASE_SERVICE_ACCOUNT` = Entire contents of service-account.json file

### Base.al OAuth
- `OAUTH_BASE_CLIENT_ID` = `albdev-DzI`
- `OAUTH_BASE_CLIENT_SECRET` = `1Zeyr4zb-G-albdev-4bT`
- `OAUTH_BASE_REDIRECT_URI` = `https://albanian.dev/auth/callback`

## How to Add Secrets

1. Go to your repository on GitHub
2. Click Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret from the list above

## Manual Deployment

You can also trigger deployment manually:
1. Go to Actions tab
2. Select "Deploy to Firebase" workflow
3. Click "Run workflow"

## After Setup

Once secrets are added, every push to the branch will automatically:
1. Build the Nuxt app
2. Deploy to Firebase Hosting
3. Deploy Firestore rules and indexes
4. Your app goes live!
