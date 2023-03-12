type Post = {message: string, time: string}

export function commentsTemplate(comments: Post[], responseTo: string) {
  const lis = comments
    .map(postToElement)
    .map(add4Spaces)
    .join('\n')

  const commentsHtml = lis.length
    ? `  \n${lis}\n`
    : '  <p>No comments yet, be the first!</p>'

  const originalSite = responseTo === 'nothing'
    ? '<p><a href="/index.html" rel="home">Home</a></p>'
    : `<p><a href="/${responseTo.replace('_', '/')}.html">Original post</a></p>`

  const subject = responseTo === 'nothing'
    ? 'This is a general message'
    : `This is a response to "${responseTo.split('_')[1].replace(/-/g, ' ')}".`

  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-us" xml:lang="en-us">
<title>Post your comment</title>
<meta name="author" content="Norman Perrin" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
<meta name="theme-color" content="#040309" />
<meta name="msapplication-TileColor" content="#040309" />
<meta name="msapplication-TileImage" content="/img/favicon.png" />
<meta name="application-name" content="nperrin" />
<meta name="og:image" content="/img/thumbnail.png" />
<meta name="og:url" content="https://nperrin.io/comment?responseTo=${responseTo}" />
<meta name="og:site_name" content="Post your comment" />
<meta name="og:title" content="Post your comment" />
<link rel="icon" type="image/png" href="/img/favicon.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png" />
<link rel="mask-icon" href="/img/safari-pinned-tab.svg" color="#54c99d" />
<link rel="stylesheet" href="/comment.css" />

<nav>
  ${originalSite}
</nav>

<header>
  <h1>Post your comment!</h1>
</header>

<main>
  <p>You can identify if you want by leaving a firm at the bottom of the message. ASCII art accepted 👉</p>
  <p><i>${subject}</i></p>
  <form method="post">
    <textarea name="comment" maxlength="500" autofocus required></textarea>
    <input type="submit" value="Send" />
  </form>

  <h2>Comments</h2>
  <section role="list" class="comments">
  ${commentsHtml}
  </section>
</main>

</html>`
}

function postToElement(comment: Post) {
  const showableTime = new Date(comment.time).toUTCString()
  return `<div role="listitem">
      <time datetime="${comment.time}">${showableTime}</time>
      <p>${comment.message}</p>
    </div>`
}

function add4Spaces(something: string) {
  return `    ${something}`
}
