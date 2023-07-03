import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core';

export const globalMetadata = sqliteTable('global_metadata', {
  id: integer('id').primaryKey().notNull(),
  default_channel: text('default_channel'),
  refresh_interval: integer('refresh_interval')
    .default(parseInt(process.env.REFRESH_INTERVAL || '') || 30)
    .notNull(),
  bot_metadata: blob('bot_metadata', { mode: 'json' }),
});
