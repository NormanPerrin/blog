import { PostInfo } from "../markdown";

type ListProps = {
  category_title: string
  category: string
  post_list: string
}

export function list_post({category_title, category, post_list}: ListProps) {
  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-us" xml:lang="en-us">
<title>My blog | ${category_title}</title>
<meta name="author" content="Norman Perrin" />
<meta name="description" content="List of posts for ${category_title}" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
<meta name="theme-color" content="#040309" />
<meta name="msapplication-TileColor" content="#040309" />
<meta name="msapplication-TileImage" content="/img/favicon.png" />
<meta name="application-name" content="nperrin" />
<meta name="og:image" content="/img/thumbnail.png" />
<meta name="og:url" content="https://nperrin.io/${category_title}" />
<meta name="og:site_name" content="Posts for ${category_title}" />
<meta name="og:title" content="Posts for ${category_title}" />
<link rel="icon" type="image/png" href="/img/favicon.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png" />
<link rel="mask-icon" href="/img/safari-pinned-tab.svg" color="#54c99d" />
<link rel="stylesheet" href="/list.css" />

<header>
  <nav>
    <p>
      <a href="/index.html" rel="home">Home</a>
    </p>
  </nav>
  <h1>${category_title}</h1>
</header>

<main>
  <nav role="list">
${post_list}
  </nav>
</main>

<footer>
  <h2>Follow my updates!</h2>
  <p>You need to copy and paste this URLs into your RSS client.</p>
  <ul>
    <li><span>For <b>${category}</b> updates: </span><a href="/${category}/rss.xml">/${category}/rss.xml</a></li>
    <li><span>And for <b>all</b> updates: </span><a href="/rss.xml">/rss.xml</a></li>
  </ul>
  <p>Do you know what this icon is? <img src="/img/rss.png" alt="rss feed" width="16" height="16" /></p>
  <p>If not, <a href="https://nperrin.io/tech/why-using-rss-feed.html">learn about RSS feeds here!</a></p>
</footer>
</html>`
}

export function list_item(props: PostInfo) {
  const date = props.published.toISOString().split('T')[0];
  return `<p role="listitem"><a href="${props.link}"><span class="title">${props.title}</span><span class="description">${props.description}</span><span class="time">(<time>${date}</time>)</span></a></p>`
}
