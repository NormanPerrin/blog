type HeaderProps = {
  title: string
  description: string
  lang: 'es' | 'en'
  published: Date
  keywords: string[]
  category: string
  url: string
}

export function header(props: HeaderProps) {
  const published = props.published.toISOString().slice(0, 10)

  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${props.lang}" xml:lang="${props.lang}">

<head>
  <title>${props.title}</title>
  <meta charset="utf-8" />
  <meta name="generator" content="lowdown" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
  <meta name="author" content="Norman Perrin" />
  <link rel="canonical" href="https://nperrin.io/${props.url}" />
  <meta name="description" content="${props.description}" />
  <meta name="keywords" content="${props.keywords.join(', ')}" />
  <meta name="dcterms.date" content="${published}" />
  <meta name="dcterms.created" content="${published}" />
  <link rel="schema.dcterms" href="http://purl.org/dc/terms/" />
  <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png" />
  <link rel="mask-icon" href="/img/safari-pinned-tab.svg" color="#54c99d" />
  <meta name="theme-color" content="#040309" />
  <meta name="msapplication-TileColor" content="#040309" />
  <meta name="msapplication-TileImage" content="/img/favicon.png" />
  <meta name="application-name" content="nperrin" />
  <meta name="og:title" content="${props.title}" />
  <meta name="og:description" content="${props.description}" />
  <meta name="og:site_name" content="A blog" />
  <meta name="og:url" content="https://nperrin.io/${props.url}" />
  <meta name="og:type" content="article" />
  <meta name="og:image" content="/img/thumbnail.png" />
  <link rel="icon" type="image/png" href="/img/favicon.png" />
  <link rel="alternate" href="https://nperrin.io/${props.category}.xml" type="application/rss+xml" hreflang="en-us"
    title="Norman Perrin | ${props.category}" />
  <link rel="stylesheet" href="/styles.css" />
</head>

<nav>
  <p>
    <a href="/index.html" rel="home">Home</a>
    <span> / </span>
    <a href="/${props.category}/index.html">${props.category}</a>
  </p>
</nav>

<main>
  <article class="h-entry">
    <header>
      <h1 class="p-name">${props.title}</h1>
      <p class="p-summary"><em>${props.description}</em></p>
      <p><time class="dt-published" datetime="${published}">${published}</time></p>
    </header>

    <div class="e-content">`
}


export function footer(lang: 'es' | 'en', url: string) {
  const written_by = lang === 'es' ? 'Escrito por' : 'Written by'
  const responseTo = url.replace('/', '_').replace('.html', '')

  return `</div>

<footer>
  <p>${written_by} <a href="https://nperrin.io" rel="author me" class="u-author">Norman Perrin</a>.</p>
  <p><a href="/comment.html?responseTo=${responseTo}">Comments</a></p>
</footer>
</article>
</main>

</html>`
}
