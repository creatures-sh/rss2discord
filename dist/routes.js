"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putDefaultChannel = void 0;
const db_1 = require("./src/db");
const schema_1 = require("./src/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const putDefaultChannel = (request, response) => {
    const defaultChannel = request.body.default_channel;
    console.log(`Saving ${defaultChannel} as the default channel...`);
    if (!defaultChannel) {
        response.status(400);
        return { message: 'default_channel is required' };
    }
    const { newDefaultChannel } = db_1.db
        .insert(schema_1.globalMetadata)
        .values({ id: 1, default_channel: defaultChannel })
        .onConflictDoUpdate({
        target: schema_1.globalMetadata.default_channel,
        set: { default_channel: defaultChannel },
        where: (0, drizzle_orm_1.eq)(schema_1.globalMetadata.id, 1),
    })
        .returning({ newDefaultChannel: schema_1.globalMetadata.default_channel })
        .get();
    console.log(`${newDefaultChannel} is now the new default channel.`);
    return { message: 'success', default_channel: newDefaultChannel };
};
exports.putDefaultChannel = putDefaultChannel;
