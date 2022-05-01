#!/bin/sh


index_path="$1"
category="$(echo "$1" |sed 's@blog/content/@@')"

rss_feed=/tmp/.rss_feed
out_rss='blog/dist/rss.xml'
description='Recent content from Norman Perrin'
feed_src="https://nperrin.io/rss.xml"

if [ -n "$category" ]; then
    rss_feed="/tmp/.rss_feed_$category"
    out_rss="blog/dist/$category/rss.xml"
    description="Recent $category content"
    feed_src="https://nperrin.io/$category/rss.xml"
fi


# setup
rm -fr "$rss_feed" "$out_rss"


list_dates () {
    type="$(rg -m 1 '^type:' "$1"|cut -d ' ' -f 2)"

    if [ "$type" = 'private' ]; then
        return;
    fi

	date="$(rg -m 1 '^published:' "$1"|cut -d ' ' -f 2-)"
	printf "%s %s\n" "$date" "$1"
}


map_date () {
	timestamp="$(date -j -f '%Y-%m-%d' '+%s' "$1")"
	date -r "$timestamp" '+%a, %d %b %Y'
}


rss_item () {
    path="$(echo "$1" |cut -d ' ' -f 2-)"
    compliant_date="$(map_date "$(rg -m 1 '^published:' "$path" |cut -d ' ' -f 2-)")"
    url="$(echo "$path" |sed 's@blog/content@@; s/\.md/.html/')"
    title="$(printf '\t\t\t<title>%s</title>' "$(rg -m 1 '^title:' "$path" |cut -d ' ' -f 2-)")"
    link="$(printf '\t\t\t<link>https://nperrin.io%s</link>' "$url")"
    description="$(printf '\t\t\t<description>%s</description>' "$(rg -m 1 '^description:' "$path" |cut -d ' ' -f 2-)")"
    pubDate="$(printf '\t\t\t<pubDate>%s</pubDate>' "$compliant_date")"
    guid="$(printf '\t\t\t<guid>https://nperrin.io%s</guid>' "$url")"
    rss_category="$(printf '\t\t\t<category>%s</category>' "$(rg -m 1 '^category:' "$path" |cut -d ' ' -f 2)")"
    source="$(printf '\t\t\t<source url=\"%s\">nperrin</source>' "$feed_src")"

    printf '\t\t<item>\n%s\n%s\n%s\n%s\n%s\n%s\n%s\n\t\t</item>\n' "$title" "$pubDate" "$description" "$link" "$guid" "$source" "$rss_category"
}


# Header
mkdir -p "$(dirname "$out_rss")"
printf '<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>\n<?xml-stylesheet type=\"text/css\" href=\"/rss.css\"?>\n<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\">\n\t<channel>\n\t\t<title>Norman Perrin %s</title>\n\t\t<link rel=\"self\" type=\"application/rss+xml\">%s</link>\n\t\t<link rel=\"author\" type=\"text/html\">%s</link>\n\t\t<link rel=\"alternate\" type=\"text/html\">%s</link>\n\t\t<docs>http://backend.userland.com/rss</docs>\n\t\t<description>%s</description>\n\t\t<language>en-us</language>\n\t\t<image>\n\t\t\t<url>https://files.nperrin.io/img/me.jpeg</url>\n\t\t\t<title>Norman Perrin</title>\n\t\t\t<link rel=\"self\" type=\"application/rss+xml\">%s</link>\n\t\t\t<width>140</width>\n\t\t\t<height>140</height>\n\t\t</image>\n\t\t<lastBuildDate>%s</lastBuildDate>\n\t\t<atom:link href=\"%s\" rel=\"self\" type=\"application/rss+xml\"/>\n' "$category" "$feed_src" "https://nperrin.io" "https://nperrin.io/$category/index.html" "$description" 'https://nperrin.io/rss.xml' "$(rss-create-pubDate)" "$feed_src" > "$out_rss"


# Get posts ordered by date
fd -t f '.md' "$index_path" |while read -r file_path; do list_dates "$file_path" >> "$rss_feed"; done
feed_list="$(sort -r "$rss_feed")"
rm -f "$rss_feed"


# Generate rss entry for each post
printf "$feed_list" |while read -r line || [ -n "$line" ]; do rss_item "$line" >> "$out_rss"; done
printf '\t</channel>\n</rss>\n' >> "$out_rss"
