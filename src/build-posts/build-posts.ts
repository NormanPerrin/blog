import { spawn } from "child_process"
import { existsSync, readdirSync, mkdirSync, createReadStream } from "fs"
import { writeFile } from "fs/promises"
import { join } from "path"
import { randomHash } from "../helpers"
import { footer, header } from "./template"

const project_dir = join(process.env.CODE!, 'nperrin.io')
const content_dir = join(project_dir, 'blog/content')
const dist_dir = join(project_dir, 'blog/dist')

async function run() {
  const categories = readdirSync(content_dir)

  const promises = categories.flatMap((category) => {
    const category_dir = join(content_dir, category)
    const category_dist = join(dist_dir, category)

    if (!existsSync(category_dist)) {
      mkdirSync(category_dist)
    }

    const files = readdirSync(category_dir)

    return files.map(async (filename) => {
      const is_private = /.private.md$/.test(filename)
      const post_path = join(category_dir, filename)
      const post_dist = is_private
        ? join(category_dist, `${filename.replace('.private.md', '')}.${randomHash()}.html`)
        : join(category_dist, filename.replace('.md', '.html'))
      const metadata = await head_info(post_path)

      const url = join(category, filename.replace('.md', ''))
      const file_content = ''.concat(
        header({
          title: metadata.title,
          description: metadata.description,
          lang: metadata.lang,
          category: metadata.category,
          published: metadata.published,
          keywords: metadata.keywords,
          url
        }),
        await body(post_path),
        footer(metadata.lang, url)
      )

      console.log(`> ${post_dist.split('/').pop()}`)
      return writeFile(post_dist, file_content)
    })
  })

  return Promise.all(promises)
}

function body(path: string): Promise<string> {
  const pandoc_process = spawn('pandoc', ['-f', 'markdown', '-t', 'html', '--no-highlight', path])
  let rtnBody = ''

  return new Promise((resolve, reject) => {
    pandoc_process?.stderr?.on('data', (data) => {
      reject(data.toString())
    })
    pandoc_process?.stdout?.on('data', (chunk) => {
      rtnBody = rtnBody.concat(chunk.toString('utf-8'))
    })
    pandoc_process.once('close', () => {
      resolve(rtnBody)
    })
  })
}

function head_info(path: string): Promise<Metadata> {
  return new Promise(resolve => {
    const readStream = createReadStream(path, { end: 250 })
    readStream.once('data', (chunk) => {
      readStream.close()

      const text = chunk.toString('utf-8')
      const lines = text.split('\n')
      const [start, end] = lines.reduce<number[]>((limits, line, i) => {
        line === '---' && limits.push(i)
        return limits;
      }, [])
      const metadata = lines
        .slice(start + 1, end)
        .reduce<Partial<Metadata>>((obj, line) => {
          const [key, value] = line.split(': ') as [MetaKeys, string]

          if (!metaKeys.includes(key)) {
            throw new Error(`Invalid key ${key}`)
          }

          obj[key] = value as any

          if (key === 'published') {
            obj[key] = new Date(value)
          }
          if (key === 'keywords') {
            obj[key] = value.split(',').map(k => k.trim())
          }

          return obj
        }, {})

      if (!metadata.type) { metadata.type = 'private' }
      if (!metadata.lang) { metadata.lang = 'es' }
      if (!metadata.keywords) { metadata.keywords = [] }

      if (Object.keys(metadata).length !== metaKeys.length) {
        throw new Error(`Post has non complete keys.\nMetadata: ${JSON.stringify(metadata)}`)
      }

      resolve(metadata as Metadata)
    })
  })
}

const metaKeys = ['title', 'description', 'published', 'category', 'lang', 'type', 'keywords'] as const
type MetaKeys = typeof metaKeys[number]

type Metadata = {
  title: string
  description: string
  published: Date
  category: string
  lang: 'es' | 'en'
  keywords: string[]
  type: 'public' | 'private'
}

run().catch(console.error)
