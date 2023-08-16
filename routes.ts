import { RouteHandler } from 'fastify';
import { eq } from 'drizzle-orm';
import findFeed from 'feedrat';
import { promisify } from 'util';
import { extract } from '@extractus/feed-extractor';

const asyncFindFeed = promisify(findFeed);

import { db } from './src/db';
import {
  feeds,
  globalMetadata,
  entries as entriesTable,
} from './src/db/schema';

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
  channel?: string;
}

export const postSubscribe: RouteHandler<{ Body: SubscribeBody }> = async (
  request,
  response
) => {
  const url = request.body?.url;
  const channel = request.body?.channel;

  if (!url) {
    response.status(400);
    return { message: 'url is required' };
  }

  let feedUrl: string;

  try {
    const listOfUrls = await asyncFindFeed(url);
    if (listOfUrls.length > 1) {
      response.status(400);
      return {
        message: 'Multiple feeds found; Please choose one.',
        feeds: listOfUrls,
      };
    }

    feedUrl = listOfUrls[0];
  } catch (err) {
    response.status(400);
    return { message: err };
  }

  const existingSub = db
    .select()
    .from(feeds)
    .where(eq(feeds.feed_url, feedUrl))
    .get();

  if (existingSub) {
    response.status(409);
    return { message: 'A subscription for this feed already exists.' };
  }

  const feed_results = await extract(feedUrl);
  const { title, description, link, entries } = feed_results;

  if (!entries || entries.length === 0) {
    db.insert(feeds)
      .values({
        feed_url: feedUrl,
        page_url: url,
        title,
        description,
        link,
        channel,
      })
      .get();
    response.status(204);
    return {
      message: "The provided feed exists, but it doesn't contain any items.",
    };
  }

  const { id } = db
    .insert(feeds)
    .values({
      feed_url: feedUrl,
      page_url: url,
      title,
      description,
      link,
    })
    .returning({ id: feeds.id })
    .get();

  await db.transaction(async (tx) => {
    entries.forEach((entry) => {
      tx.insert(entriesTable)
        .values({
          entry_id: entry.id,
          feed: id,
        })
        .run();
    });
  });

  return {
    lastEntry: entries[0],
  };
};

export const getList: RouteHandler = async (request, response) => {
  try {
    const subscriptions = db.select().from(feeds).all();
    response.status(200);
    return { subscriptions };
  } catch (e) {
    response.status(200);
    return { subscriptions: [] };
  }
};
