import { RouteHandler } from 'fastify';
import { db } from './src/db';
import type { FastifyRequest } from 'fastify';
import { globalMetadata } from './src/db/schema';
import { eq } from 'drizzle-orm';

interface DefaultChannelBody {
  default_channel: string;
}

export const putDefaultChannel: RouteHandler<{ Body: DefaultChannelBody }> = (
  request,
  response
) => {
  const defaultChannel = request.body.default_channel;

  console.log(`Saving ${defaultChannel} as the default channel...`);

  if (!defaultChannel) {
    response.status(400);
    return { message: 'default_channel is required' };
  }

  const { newDefaultChannel } = db
    .insert(globalMetadata)
    .values({ id: 1, default_channel: defaultChannel })
    .onConflictDoUpdate({
      target: globalMetadata.default_channel,
      set: { default_channel: defaultChannel },
      where: eq(globalMetadata.id, 1),
    })
    .returning({ newDefaultChannel: globalMetadata.default_channel })
    .get();

  console.log(`${newDefaultChannel} is now the new default channel.`);

  return { message: 'success', default_channel: newDefaultChannel };
};
