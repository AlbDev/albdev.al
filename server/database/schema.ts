import { pgTable, text, timestamp, integer, boolean, uuid, index, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Firebase UID
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  displayName: text('display_name'),
  avatar: text('avatar'),
  bio: text('bio'),
  karma: integer('karma').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
  usernameIdx: index('username_idx').on(table.username)
}))

// Communities (subreddits)
export const communities = pgTable('communities', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  displayName: text('display_name').notNull(),
  description: text('description'),
  icon: text('icon'),
  banner: text('banner'),
  memberCount: integer('member_count').default(0).notNull(),
  creatorId: text('creator_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  nameIdx: index('community_name_idx').on(table.name)
}))

// Posts
export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  type: text('type').notNull().default('text'), // text, link, image
  url: text('url'),
  authorId: text('author_id').notNull().references(() => users.id),
  communityId: uuid('community_id').notNull().references(() => communities.id, { onDelete: 'cascade' }),
  upvotes: integer('upvotes').default(0).notNull(),
  downvotes: integer('downvotes').default(0).notNull(),
  commentCount: integer('comment_count').default(0).notNull(),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  communityIdx: index('post_community_idx').on(table.communityId),
  authorIdx: index('post_author_idx').on(table.authorId),
  createdAtIdx: index('post_created_at_idx').on(table.createdAt)
}))

// Comments
export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  authorId: text('author_id').notNull().references(() => users.id),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id'), // For nested comments
  upvotes: integer('upvotes').default(0).notNull(),
  downvotes: integer('downvotes').default(0).notNull(),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  postIdx: index('comment_post_idx').on(table.postId),
  authorIdx: index('comment_author_idx').on(table.authorId),
  parentIdx: index('comment_parent_idx').on(table.parentId)
}))

// Votes on posts
export const postVotes = pgTable('post_votes', {
  userId: text('user_id').notNull().references(() => users.id),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  value: integer('value').notNull(), // 1 for upvote, -1 for downvote
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.postId] }),
  postIdx: index('post_vote_post_idx').on(table.postId)
}))

// Votes on comments
export const commentVotes = pgTable('comment_votes', {
  userId: text('user_id').notNull().references(() => users.id),
  commentId: uuid('comment_id').notNull().references(() => comments.id, { onDelete: 'cascade' }),
  value: integer('value').notNull(), // 1 for upvote, -1 for downvote
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.commentId] }),
  commentIdx: index('comment_vote_comment_idx').on(table.commentId)
}))

// Community memberships
export const communityMembers = pgTable('community_members', {
  userId: text('user_id').notNull().references(() => users.id),
  communityId: uuid('community_id').notNull().references(() => communities.id, { onDelete: 'cascade' }),
  role: text('role').default('member').notNull(), // member, moderator, admin
  joinedAt: timestamp('joined_at').defaultNow().notNull()
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.communityId] }),
  communityIdx: index('member_community_idx').on(table.communityId)
}))

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  postVotes: many(postVotes),
  commentVotes: many(commentVotes),
  memberships: many(communityMembers),
  createdCommunities: many(communities)
}))

export const communitiesRelations = relations(communities, ({ one, many }) => ({
  creator: one(users, { fields: [communities.creatorId], references: [users.id] }),
  posts: many(posts),
  members: many(communityMembers)
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  community: one(communities, { fields: [posts.communityId], references: [communities.id] }),
  comments: many(comments),
  votes: many(postVotes)
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  parent: one(comments, { fields: [comments.parentId], references: [comments.id], relationName: 'replies' }),
  replies: many(comments, { relationName: 'replies' }),
  votes: many(commentVotes)
}))
