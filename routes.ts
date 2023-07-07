import { RouteHandler } from 'fastify';
import { eq } from 'drizzle-orm';
import findFeed from 'feedrat';
import { promisify } from 'util';

const asyncFindFeed = promisify(findFeed);

import { db } from './src/db';
import { globalMetadata } from './src/db/schema';

interface DefaultChannelBody {
  default_channel: string;
}

export const putDefaultChannel: RouteHandler<{ Body: DefaultChannelBody }> = (
  request,
  response
) => {
  const defaultChannel = request.body?.default_channel;

  console.log(`Saving ${defaultChannel} as the default channel...`);

  if (!defaultChannel) {
    response.status(400);
    return { message: 'default_channel is required' };
  }

  const { newDefaultChannel } = db
    .insert(globalMetadata)
    .values({ id: 1, default_channel: defaultChannel })
    .onConflictDoUpdate({
      target: globalMetadata.id,
      set: { default_channel: defaultChannel },
      where: eq(globalMetadata.id, 1),
    })
    .returning({ newDefaultChannel: globalMetadata.default_channel })
    .get();

  console.log(`${newDefaultChannel} is now the new default channel.`);

  return { message: 'success', default_channel: newDefaultChannel };
};

interface SubscribeBody {
  url: string;
}

export const postSubscribe: RouteHandler<{ Body: SubscribeBody }> = async (
  request,
  response
) => {
  const url = request.body?.url;

  if (!url) {
    response.status(400);
    return { message: 'url is required' };
  }

  let feedUrl: string;

  try {
    feedUrl = (await asyncFindFeed(url))[0];
  } catch (err) {
    response.status(400);
    return { message: err };
  }

  // TODO: Got the URL, write to DB
};
