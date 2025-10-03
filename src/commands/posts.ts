import { getPostsForUser } from 'src/lib/db/queries/posts';
import { User } from 'src/lib/db/schema';

export async function handleBrowse(_: string, user: User, ...args: string[]) {
  const numString = Number(args[0]);
  const limit = !isNaN(numString) ? numString : 2;
  const posts = await getPostsForUser(user.id, limit);

  console.log(`Found ${posts.length} posts for user ${user.name}`);
  for (const post of posts) {
    console.log(`${post.publishedAt} from ${post.feedName}`);
    console.log(`--- ${post.title} ---`);
    console.log(`    ${post.description}`);
    console.log(`Link: ${post.url}`);
    console.log(`=====================================`);
  }
}
