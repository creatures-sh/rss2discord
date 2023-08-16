import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core';

export const globalMetadata = sqliteTable('global_metadata', {
  id: integer('id').primaryKey().notNull(),
  default_channel: text('default_channel'),
  refresh_interval: integer('refresh_interval')
    .default(parseInt(process.env.REFRESH_INTERVAL || '') || 30)
    .notNull(),
  bot_metadata: blob('bot_metadata', { mode: 'json' }),
});

export const feeds = sqliteTable('feeds', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  // [FEED] the actual XML/Atom full URL
  feed_url: text('feed_url').notNull(),
  // [USER] the URL that we got from the client
  page_url: text('page_url').notNull(),
  // [FEED] the title of the publication
  title: text('title'),
  // [FEED] the description of the publication
  description: text('description'),
  // [FEED] the <link> property from the feed
  link: text('link'),
  // [USER] user-submitted channel for this feed
  channel: text('channel'),
});

export const entries = sqliteTable('entries', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  entry_id: text('entry_id').notNull(),
  feed: integer('feed'),
});
