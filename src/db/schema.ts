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
  feed_url: text('feed_url').notNull(),
  page_url: text('page_url').notNull(),
  title: text('title'),
  description: text('description'),
  link: text('link'),
  last_item_guid: text('last_item_guid'),
  last_item_pub_date: text('last_item_pub_date'),
  channel: text('channel'),
});
