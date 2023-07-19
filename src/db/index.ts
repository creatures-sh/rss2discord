import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import {
  drizzle,
  type BetterSQLite3Database,
} from 'drizzle-orm/better-sqlite3';
import { globalMetadata } from './schema';

const db_url = process.env.DATABASE_URL || './local.db';

const sqlite = new Database(db_url);
export const db: BetterSQLite3Database = drizzle(sqlite, {
  logger: true,
});

void migrate(db, { migrationsFolder: 'src/db/migrations' });

// DB SEED
db.transaction(async (tx) => {
  await tx
    .insert(globalMetadata)
    .values({
      id: 1,
      refresh_interval: parseInt(process.env.REFRESH_INTERVAL || '') || 30,
    })
    .onConflictDoNothing();
});
