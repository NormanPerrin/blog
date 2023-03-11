import { readdirSync, readFileSync, rmSync } from "fs"
import { writeFile } from "fs/promises"
import { join } from "path"
import { commentsTemplate } from "./template"

const project_dir = join(process.env.CODE!, 'nperrin.io')
const possibleResponseToFilePath = join(project_dir, 'comments/possible-response-to.txt')

const possibleResponseTo = readFileSync(possibleResponseToFilePath, 'utf8')
  .split('\n')
  .slice(0, -1)
const comments = readFileSync(join(project_dir, 'comments/comments.json'), 'utf8')
  .split('\n')
  .slice(0, -1)
  .map(comment => JSON.parse(comment))

readdirSync(join(project_dir, 'comments'))
  .filter(file => file.endsWith('.html'))
  .forEach(file => rmSync(join(project_dir, 'comments', file)));

async function run() {
  const promises = possibleResponseTo.map(responseTo => {
    const responseToComments = comments.filter(comment => comment.responseTo === responseTo)
    const fileContent = commentsTemplate(responseToComments, responseTo)
    const outPath = join(project_dir, `comments/${responseTo}.html`)
    return writeFile(outPath, fileContent)
  })

  const responseToNothingComments = comments.filter(comment => comment.responseTo === 'nothing')
  const fileContent = commentsTemplate(responseToNothingComments, 'nothing')
  const outPath = join(project_dir, `comments/nothing.html`)
  promises.push(writeFile(outPath, fileContent))

  await Promise.all(promises)
}

run()
