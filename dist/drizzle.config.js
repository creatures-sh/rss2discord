"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    schema: './src/db/schema.ts',
    out: './src/db/migrations',
    driver: 'better-sqlite',
    verbose: true,
    dbCredentials: {
        url: process.env.DATABASE_URL || './local.db',
    },
};
