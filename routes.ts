import { RouteHandler } from 'fastify';
import { eq } from 'drizzle-orm';
import findFeed from 'feedrat';
import { promisify } from 'util';
import { extract } from '@extractus/feed-extractor';

const asyncFindFeed = promisify(findFeed);

import { db } from './src/db';
import { feeds, globalMetadata } from './src/db/schema';

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
    const listOfUrls = await asyncFindFeed(url);
    console.log(listOfUrls);
    if (listOfUrls.length > 1) {
      response.status(400);
      return { message: 'Multiple feeds found; Please choose one.', feeds: listOfUrls }
    }

    feedUrl = listOfUrls[0];
  } catch (err) {
    response.status(400);
    return { message: err };
  }

  // URL, ID
  const feed_results = await extract(feedUrl);
  
  let { title, description, link, entries } = feed_results;
  // TITLE, DESCRIPTION, LINK

  const last_entry = entries?.sort((a ,b) => new Date(b.published || '').getTime() - new Date(a.published || '').getMinutes())[0];
  // LAST ITEM GUID, LAST ITEM PUB DATE
  console.log(last_entry)

  // const { published } = last_entry;

  const normalizedPublish = last_entry?.published ? (last_entry?.published as any as string) : new Date().toISOString();
  console.log(normalizedPublish);

  const { last_item_guid } = db
    .insert(feeds)
    .values({ feed_url: feedUrl, page_url: url, title, description, link, last_item_guid: last_entry?.id, last_item_pub_date: normalizedPublish })
    .returning({ last_item_guid: feeds.last_item_guid })
    .get();

  const entry = entries?.find((entry) => entry.id === last_item_guid);

  return {
    lastEntry: entry,
  };

  // return { message: 'success' };
  // TODO: Got the URL, write to DB
};
