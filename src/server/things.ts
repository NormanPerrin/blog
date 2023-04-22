import { IncomingMessage } from 'http'
import { appendFile, readFile } from 'fs/promises'

export class WaitForDataError extends Error { }
export class TooLongDataError extends Error { }
export class WriteCommentFileError extends Error { }
export class ParseMessageError extends Error { }
export class ReadCommentsFileError extends Error { }
export class TooManyCommentsError extends Error { }
export const HandlerErrors = {
  WaitForDataError,
  WriteCommentFileError,
  ParseMessageError,
  TooLongDataError,
  TooManyCommentsError,
  ReadCommentsFileError
} as const;
export type HandlerError = typeof HandlerErrors[keyof typeof HandlerErrors];

const MAX_COMMENT_SIZE = Number(process.env.MAX_COMMENT_SIZE || '500');
const MAX_COMMENTS_PER_DAY = Number(process.env.MAX_COMMENTS_PER_DAY || 20);
const COMMENTS_FILE_PATH = process.env.COMMENTS_FILE_PATH || './comments/comments.json'
console.log('Writing comments to:', COMMENTS_FILE_PATH)

export function waitForData(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body: string = ''
    req.on('data', (chunk) => {
      body += chunk
      if (body.length > MAX_COMMENT_SIZE) {
        req.pause()
        reject(new TooLongDataError('Too long data'))
      }
    })
    req.once('error', (error) => reject(new WaitForDataError(error.message)))
    req.once('end', () => resolve(body))
  })
}

export async function writeToCommentsFile(ip: string, responseTo: string, message: string) {
  const newComment = {
    time: new Date().toISOString(),
    ip,
    responseTo,
    message
  }
  try {
    await appendFile(COMMENTS_FILE_PATH, JSON.stringify(newComment) + '\n')
  }
  catch (e) {
    throw new WriteCommentFileError(e instanceof Error ? e.message : (e as string))
  }
}

export function formToObject(str: string): Record<string, unknown> {
  const [key, value] = str.split('=')
  if (key === 'message') {
    try {
      return JSON.parse(value)
    }
    catch (e) {
      throw new ParseMessageError(e instanceof Error ? e.message : (e as string))
    }
  }
  return { [key]: value }
}

async function readCommentsFile() {
  try {
    const data = await readFile(COMMENTS_FILE_PATH, 'utf-8')
    return data.split('\n').slice(0, -1).map((line) => JSON.parse(line))
  }
  catch (e) {
    throw new ReadCommentsFileError(e instanceof Error ? e.message : (e as string))
  }
}

export async function checkIfTooManyComments(ip: string) {
  const comments = await readCommentsFile()
  const ipComments = comments
    .filter(c => c.ip === ip)
    .filter(c => new Date(c.time).getDate() === new Date().getDate())
  if (ipComments.length > MAX_COMMENTS_PER_DAY) {
    throw new TooManyCommentsError()
  }
}
