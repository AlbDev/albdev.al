#!/usr/bin/env node

/**
 * Seed Communities Script
 *
 * This script populates the Firestore database with initial communities.
 * Run this AFTER you've enabled Firestore in Firebase Console.
 *
 * Usage:
 *   node scripts/seed-communities.js
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore'

// Firebase config (from nuxt.config.ts)
const firebaseConfig = {
  apiKey: 'AIzaSyDSeTvW6CbgBjRUfzG734CVuC54pv9iajM',
  authDomain: 'albaniandotdev.firebaseapp.com',
  projectId: 'albaniandotdev',
  storageBucket: 'albaniandotdev.firebasestorage.app',
  messagingSenderId: '189842779837',
  appId: '1:189842779837:web:38ac2bfc404c52a69bd1d4'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Communities to seed
const communities = [
  {
    name: 'general',
    displayName: 'General Discussion',
    description: 'General developer discussions and off-topic chat',
    creatorId: 'system',
    memberCount: 1,
    isDeleted: false
  },
  {
    name: 'javascript',
    displayName: 'JavaScript',
    description: 'JavaScript, TypeScript, Node.js, and modern web development',
    creatorId: 'system',
    memberCount: 1,
    isDeleted: false
  },
  {
    name: 'python',
    displayName: 'Python',
    description: 'Python programming, Django, Flask, and data science',
    creatorId: 'system',
    memberCount: 1,
    isDeleted: false
  },
  {
    name: 'showcase',
    displayName: 'Project Showcase',
    description: 'Show off your projects and get feedback from the community',
    creatorId: 'system',
    memberCount: 1,
    isDeleted: false
  },
  {
    name: 'jobs',
    displayName: 'Jobs & Opportunities',
    description: 'Job postings, freelance opportunities, and career discussions',
    creatorId: 'system',
    memberCount: 1,
    isDeleted: false
  },
  {
    name: 'events',
    displayName: 'Events & Meetups',
    description: 'Developer events, meetups, conferences, and workshops',
    creatorId: 'system',
    memberCount: 1,
    isDeleted: false
  },
  {
    name: 'albania',
    displayName: 'Albania Tech Scene',
    description: 'Albanian technology community, local startups, and tech culture',
    creatorId: 'system',
    memberCount: 1,
    isDeleted: false
  },
  {
    name: 'go',
    displayName: 'Go',
    description: 'Go programming language and backend development',
    creatorId: 'system',
    memberCount: 1,
    isDeleted: false
  },
  {
    name: 'rust',
    displayName: 'Rust',
    description: 'Rust programming, systems programming, and WebAssembly',
    creatorId: 'system',
    memberCount: 1,
    isDeleted: false
  },
  {
    name: 'mobile',
    displayName: 'Mobile Development',
    description: 'iOS, Android, React Native, Flutter, and mobile app development',
    creatorId: 'system',
    memberCount: 1,
    isDeleted: false
  },
  {
    name: 'devops',
    displayName: 'DevOps & Cloud',
    description: 'DevOps practices, CI/CD, Docker, Kubernetes, and cloud platforms',
    creatorId: 'system',
    memberCount: 1,
    isDeleted: false
  },
  {
    name: 'help',
    displayName: 'Help & Support',
    description: 'Get help with coding problems and technical challenges',
    creatorId: 'system',
    memberCount: 1,
    isDeleted: false
  }
]

async function seedCommunities() {
  console.log('🌱 Starting community seeding...\n')

  try {
    let created = 0
    let skipped = 0

    for (const community of communities) {
      // Check if community already exists
      const q = query(
        collection(db, 'communities'),
        where('name', '==', community.name)
      )
      const existingDocs = await getDocs(q)

      if (!existingDocs.empty) {
        console.log(`⏭️  Skipped: "${community.displayName}" already exists`)
        skipped++
        continue
      }

      // Add timestamps
      const now = new Date().toISOString()
      const communityData = {
        ...community,
        createdAt: now,
        updatedAt: now
      }

      // Create community
      const docRef = await addDoc(collection(db, 'communities'), communityData)
      console.log(`✅ Created: "${community.displayName}" (ID: ${docRef.id})`)
      created++
    }

    console.log(`\n🎉 Seeding complete!`)
    console.log(`   ✅ Created: ${created} communities`)
    console.log(`   ⏭️  Skipped: ${skipped} communities (already exist)`)
    console.log(`   📊 Total: ${communities.length} communities\n`)

  } catch (error) {
    console.error('❌ Error seeding communities:', error)
    console.error('\nTroubleshooting:')
    console.error('1. Make sure Firestore is enabled in Firebase Console')
    console.error('2. Check that indexes are fully built (not "Building...")')
    console.error('3. Verify your Firebase project ID is correct')
    console.error('4. Ensure you have internet connection\n')
    process.exit(1)
  }

  process.exit(0)
}

// Run the seeder
seedCommunities()
