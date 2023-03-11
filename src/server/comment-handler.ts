import { join } from 'path';
import { createReadStream, readFileSync } from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import { authoriseComment } from './post-authorizer';
import { checkIfTooManyComments, formToObject, waitForData, WaitForDataError, writeToCommentsFile } from './things';

const COMMENTS_PATH = process.env.COMMENTS_PATH || join(__dirname, '../../comments')
const possibleResponseTo = readFileSync(join(COMMENTS_PATH, 'possible-response-to.txt'), 'utf8').split('\n').slice(0, -1)

export async function postCommentHandler(req: IncomingMessage, res: ServerResponse) {
  await authoriseComment(req)

  if (req.headers['content-type'] !== 'application/x-www-form-urlencoded') {
    res.statusCode = 400
    res.end('Bad request, application/x-www-form-urlencoded')
    return
  }

  await checkIfTooManyComments(req.headers['x-real-ip'] as string)

  const data = await waitForData(req)
  if (!data) {
    throw new WaitForDataError()
  }

  const formData = formToObject(data)
  if (typeof formData.comment !== 'string') {
    res.statusCode = 400
    res.end('Bad request, no comment (field)')
    return
  }

  const completeUrl = 'https://nperrin.io' + req.url
  const responseTo = new URL(completeUrl).searchParams.get('responseTo') || 'nothing'
  if (!possibleResponseTo.includes(responseTo) && responseTo !== 'nothing') {
    res.statusCode = 404
    res.end('Invalid response.\nThe responseTo query url should be one of:\n' + possibleResponseTo.map(r => `  ${r}`).join('\n'))
    return
  }

  console.log('Writing comment...')
  await writeToCommentsFile(
    req.headers['x-real-ip'] as string,
    responseTo,
    decodeURIComponent(formData.comment).replace(/\+/g, ' '),
  )

  const redirectUrl = responseTo === 'nothing' ? '/' : `/${responseTo.replace('_', '/')}.html`
  const thanksMessage = responseTo === 'nothing'
    ? 'You will be redirect to the home page in 7 seconds...'
    : 'You will be redirected to the post page in 7 seconds...'
  res.setHeader('Content-Type', 'text/html')
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Thanks for your comment!</title>
<meta http-equiv="refresh" content="7; url='${redirectUrl}'" />
</head>
<style>
  html {
    font-size: 18px;
    line-height: 1.5;
    font-family: Geneva, Arial, Sans-serif;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #040309;
    color: #fff;
  }
  main {
    max-width: 500px;
    margin: 0 auto;
  }
</style>

<main>
<h1>Thanks for your comment!</h1>
<p>${thanksMessage}</p>
</main>
`)
  res.end()
}

export async function getCommentHandler(req: IncomingMessage, res: ServerResponse) {
  const completeUrl = 'https://nperrin.io' + req.url
  const responseTo = new URL(completeUrl).searchParams.get('responseTo') || 'nothing'
  const commentsFilePath = join(COMMENTS_PATH, `${responseTo}.html`)

  if (!possibleResponseTo.includes(responseTo) && responseTo !== 'nothing') {
    res.statusCode = 404
    res.end('Invalid response.\nThe responseTo query url should be one of:\n' + possibleResponseTo.map(r => `  ${r}`).join('\n'))
    return
  }

  res.setHeader('Content-Type', 'text/html')
  res.statusCode = 200
  createReadStream(commentsFilePath).pipe(res)
}
