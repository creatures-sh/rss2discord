import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import {
  drizzle,
  type BetterSQLite3Database,
} from 'drizzle-orm/better-sqlite3';

const db_url = process.env.DATABASE_URL || './local.db';

const sqlite = new Database(db_url);
export const db: BetterSQLite3Database = drizzle(sqlite, {
  logger: true,
});

migrate(db, { migrationsFolder: 'src/db/migrations' });
