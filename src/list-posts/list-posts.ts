import { readdirSync, writeFileSync } from "fs"
import { writeFile, appendFile } from "fs/promises"
import { join } from "path"
import { space } from "../helpers"
import { posts_from_path } from "../markdown"
import { list_item, list_post } from "./template"

const project_dir = join(process.env.CODE!, 'sites/nperrin.io')
const content_dir = join(project_dir, 'blog/content')
const possibleResponseToFilePath = join(project_dir, 'comments/possible-response-to.txt')

writeFileSync(possibleResponseToFilePath, '')

const add_4_spaces = (str: string) => space(4).concat(str)

async function run() {
  const categories = readdirSync(content_dir)

  const promises = categories.map(async (category) => {
    const category_path = join(content_dir, category)
    const out_path = join(project_dir, 'blog/dist/', category, 'index.html')
    const posts = await posts_from_path(category_path)
    const post_list = posts
      .map(list_item)
      .map(add_4_spaces)
      .join('\n')
    const file_content = list_post({
      category: category,
      category_title: category.replace(/^\w/, c => c.toUpperCase()),
      post_list
    })

    const possibleCategoryResponses = posts.map(post => post.link.split('/').slice(-2).join('_').replace('.html', '')).join('\n').concat('\n')

    return writeFile(out_path, file_content)
      .then(() => appendFile(possibleResponseToFilePath, possibleCategoryResponses))
  })

  await Promise.all(promises)
}

run().catch(console.error)
