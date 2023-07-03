"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const migrator_1 = require("drizzle-orm/better-sqlite3/migrator");
const better_sqlite3_2 = require("drizzle-orm/better-sqlite3");
const db_url = process.env.DATABASE_URL || './local.db';
const sqlite = new better_sqlite3_1.default(db_url);
exports.db = (0, better_sqlite3_2.drizzle)(sqlite, {
    logger: true,
});
(0, migrator_1.migrate)(exports.db, { migrationsFolder: 'src/db/migrations' });
