"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalMetadata = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.globalMetadata = (0, sqlite_core_1.sqliteTable)('global_metadata', {
    id: (0, sqlite_core_1.integer)('id').primaryKey().notNull(),
    default_channel: (0, sqlite_core_1.text)('default_channel'),
    refresh_interval: (0, sqlite_core_1.integer)('refresh_interval')
        .default(parseInt(process.env.REFRESH_INTERVAL || '') || 30)
        .notNull(),
    bot_metadata: (0, sqlite_core_1.blob)('bot_metadata', { mode: 'json' }),
});
