import { PostInfo } from "../markdown"

export const rss_head = `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<?xml-stylesheet type="text/css" href="/rss.css"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Norman Perrin</title>
		<link rel="self" type="application/rss+xml">https://nperrin.io/rss.xml</link>
		<link rel="author" type="text/html">https://nperrin.io</link>
		<link rel="alternate" type="text/html">https://nperrin.io//index.html</link>
		<docs>http://backend.userland.com/rss</docs>
		<description>Recent content from Norman Perrin</description>
		<language>en-us</language>
		<image>
			<url>https://nperrin.io/img/me.png</url>
			<title>Norman Perrin</title>
			<link rel="self" type="application/rss+xml">https://nperrin.io/rss.xml</link>
			<width>140</width>
			<height>140</height>
		</image>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		<atom:link href="https://nperrin.io/rss.xml" rel="self" type="application/rss+xml"/>`

export const rss_tail = `\t</channel>\n</rss>`

export function create_rss_item({title, description, category, published, link}: PostInfo) {
  return `		<item>
			<title>${title}</title>
			<pubDate>${published.toUTCString()}</pubDate>
			<description>${description}</description>
			<link>${link}</link>
			<guid>${link}</guid>
			<source url="https://nperrin.io/${category}/rss.xml">nperrin</source>
			<category>${category}</category>
		</item>`
}
