import { readdirSync } from "fs"
import { readFile } from "fs/promises"
import { join } from "path"
import { ItemRssProps } from "./rss-template"

type HeadType = Omit<ItemRssProps, 'link'>

function get_head_content(content: string) {
  const lines = content.split('\n').slice(1),
    last_head_index = lines.findIndex(line => line === '---')

  return lines
    .slice(0, last_head_index)
    .reduce((obj, line) => {
      const [key, value] = line.split(': ')
      obj[key] = value
      return obj
    }, {} as Record<string, string>)
}

function raw_to_head(obj: Record<string, unknown>): HeadType {
  if (
    typeof obj.title === 'string'
    || typeof obj.description === 'string'
    || typeof obj.published === 'string'
    || typeof obj.category === 'string'
  ) {
    return {
      title: obj.title as string,
      description: obj.description as string,
      date: new Date(obj.published as string),
      category: obj.category as string
    }
  }
  throw new Error('Header info not valid')
}

function abs_path_to_link(path: string) {
  const link = path.replace(/.*(\/.*\/.*)\.md$/, '$1.html')
  return `https://nperrin.io${link}`
}

export async function posts_from_path(category_directory: string) {
  const post_filenames = readdirSync(category_directory)
  const post_paths = post_filenames
    .filter(p => !/\.private\.md$/.test(p))
    .map(p => join(category_directory, p))

  const post_promises = post_paths.map(async (post_path) => {
    const post_content = await readFile(post_path, 'utf-8')
    const head_raw_content = get_head_content(post_content)
    return <ItemRssProps>{
      ...raw_to_head(head_raw_content),
      link: abs_path_to_link(post_path)
    }
  })

  const posts = await Promise.all(post_promises)

  return posts.sort((a, b) => b.date.getTime() - a.date.getTime())
}
