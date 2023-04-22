import { createReadStream, existsSync, lstatSync } from 'fs';
import { createServer, IncomingMessage, ServerResponse } from 'http'
import { join } from 'path';
import { URL } from 'url';
import { HandlerErrors } from './things';
import { getCommentHandler, postCommentHandler } from './comment-handler'
import { AuthoriseErrors } from './post-authorizer';

const routes: Record<string, Function> = {
  ['GET /comment.html']: getCommentHandler,
  ['POST /comment.html']: postCommentHandler,
}

const server = createServer((req, res) => {
  try {
    console.log(req.method, req.url)
    req.setEncoding('utf-8')

    const { method, url } = req
    if (!url || !method) {
      return notFoundHandler(res)
    }
    const { pathname } = new URL(url, 'http://localhost:8080')

    const route = routes[`${method} ${pathname}`]
    if (route) {
      return route(req, res)
    } else {
      return notFoundHandler(res)
    }

    // temporal hack...
    if (process.env.NODE_ENV !== 'production') {
      return devHandler(req, res)
    }
  } catch (e) {
    errorHandler(res, e) // nice
  }
})

function notFoundHandler(res: ServerResponse) {
  res.statusCode = 404
  res.end('Not found')
}

function devHandler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') {
    return notFoundHandler(res)
  }

  const static_dir = join(process.env.CODE!, 'nperrin.io/blog/dist')
  const url = (!req.url || req.url === '/') ? '/index.html' : req.url;
  let full_url = join(static_dir, url)

  if (!existsSync(full_url)) {
    return notFoundHandler(res)
  }

  const stat = lstatSync(full_url)
  if (stat.isDirectory()) {
    full_url = join(full_url, 'index.html')
  }

  createReadStream(full_url).pipe(res)
  return
}

function errorHandler(res: ServerResponse, e: unknown) {
  if (!(e instanceof Error)) {
    res.statusCode = 500
    return res.end('Unknown error')
  }

  switch (e.constructor) {
    case HandlerErrors.WaitForDataError:
      res.statusCode = 400
      res.end('No data could be retrieved from body, try sending something')
      break
    case HandlerErrors.WriteCommentFileError:
      res.statusCode = 500
      res.end()
      break
    case HandlerErrors.ParseMessageError:
      res.statusCode = 400
      res.end('Parse error, bad request')
      break
    case HandlerErrors.TooLongDataError:
      res.statusCode = 400
      res.end('Comment too long, please try again but more to the point')
      break
    case HandlerErrors.TooManyCommentsError:
      res.statusCode = 429
      res.end('You have too many comments, try again tomorrow')
      break
    case HandlerErrors.ReadCommentsFileError:
      res.statusCode = 500
      res.end('Something went wrong, please contact the webmaster')
      break
    case AuthoriseErrors.ForeignError:
      res.statusCode = 403
      res.end('Foreign IP, forbidden')
      break
    case AuthoriseErrors.NoIpError:
      res.statusCode = 400
      res.end('No IP... ?')
      break
    case AuthoriseErrors.YoureTooFastError:
      res.statusCode = 429
      res.end('You are too fast, try again in a minute')
      break
    default:
      res.statusCode = 500
      res.end(e.message)
  }
}

server.listen(8080, () => {
  console.log('Listening on port 8080...')
})
