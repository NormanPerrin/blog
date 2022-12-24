import { readdirSync } from "fs";
import { writeFile } from 'fs/promises';
import { join } from "path";
import { PostInfo, posts_from_path } from "../markdown";
import { create_rss_item, rss_head, rss_tail } from "./template";

const project_dir = join(process.env.CODE!, 'sites/nperrin.io')
const content_dir = join(project_dir, 'blog/content')

async function run() {
  const categories = readdirSync(content_dir)

  let all_posts: Array<PostInfo> = []
  const write_promises = categories.map(async (category) => {
    const category_path = join(content_dir, category)
    const posts = await posts_from_path(category_path)
    const rss_items = posts.map(create_rss_item).join('\n')
    const rss_file = rss_head.concat('\n', rss_items, rss_tail)
    const rss_out_path = join(project_dir, 'blog/dist/', category, 'rss.xml')

    all_posts = all_posts.concat(posts)

    return writeFile(rss_out_path, rss_file)
  })

  return Promise.all(write_promises)
    .then(() => {
      const rss_out_path = join(project_dir, 'blog/dist/rss.xml')
      const ordered_posts = all_posts
        .sort((a, b) => b.published.getTime() - a.published.getTime())
        .map(create_rss_item)
        .join('\n')
      const rss_file = rss_head.concat('\n', ordered_posts, rss_tail)
      return writeFile(rss_out_path, rss_file)
    })
}

run().catch(console.error)
