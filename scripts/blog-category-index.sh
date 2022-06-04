#!/bin/bash

rm -f /tmp/.blog_category_*

create_category_index() {
    declare -a contents=( $(for post in "blog/content/$1/*.md"; do echo "$post"; done) )

    for (( i = 0; i < "${#contents[@]}"; i++ )); do
        title="$(rg -m 1 '^title: ' "${contents[$i]}" |cut -d ' ' -f 2-)"
        description="$(rg -m 1 '^description: ' "${contents[$i]}" |cut -d ' ' -f 2-)"
        published="$(rg -m 1 '^published: ' "${contents[$i]}" |cut -d ' ' -f 2)"
        type="$(rg -m 1 '^type: ' "${contents[$i]}" |cut -d ' ' -f 2)"
        url="$(echo "${contents[$i]}" |cut -d '/' -f 3- |sed 's/\.md$/\.html/')"

        [ -n "$type" ] && [ "$type" != 'private' ] &&
            printf '%s<p role="listitem"><a href="%s"><span class="title">%s</span><span class="description">%s</span><span class="time">(<time>%s</time>)</span></a></p>\n' "$published" "/$url" "$title" "$description" "$published" >>"/tmp/.blog_category_$1"
    done

   category_title="$(capitalize "$1" |sed 's/\-/ /g')"

   echo '<!DOCTYPE html>'
   echo '<html xmlns="http://www.w3.org/1999/xhtml" lang="en-us" xml:lang="en-us">'
   echo "<title>My blog | $category_title</title>"
   echo '<meta name="author" content="Norman Perrin" />'
   echo "<meta name=\"description\" content=\"List of posts for $category_title\" />"
   echo '<meta charset="utf-8" />'
   echo '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />'
   echo '<meta name="theme-color" content="#040309" />'
   echo '<meta name="msapplication-TileColor" content="#040309" />'
   echo '<meta name="msapplication-TileImage" content="/img/favicon.png" />'
   echo '<meta name="application-name" content="nperrin" />'
   echo '<meta name="og:image" content="/img/thumbnail.png" />'
   echo "<meta name=\"og:url\" content=\"https://nperrin.io/$category_title\" />"
   echo "<meta name=\"og:site_name\" content=\"Posts for $category_title\" />"
   echo "<meta name=\"og:title\" content=\"Posts for $category_title\" />"
   echo '<link rel="icon" type="image/png" href="/img/favicon.png" /> '
   echo '<link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />'
   echo '<link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png" />'
   echo '<link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png" />'
   echo '<link rel="mask-icon" href="/img/safari-pinned-tab.svg" color="#54c99d" />'
   echo '<link rel="stylesheet" href="/list.css" />'
   echo ''
   echo '<header>'
   echo '  <p><a href="/index.html" rel="home">Home</a></p>'
   echo "  <h1>$category_title</h1>"
   echo '</header>'
   echo ''
   echo '<main>'
   echo '  <nav role="list">'
   sort -r "/tmp/.blog_category_$1" |sed 's/.*<p/<p/'
   echo '  </nav>'
   echo '</main>'
   echo ''
   echo '<footer>'
   echo '  <h2>Follow my updates!</h2>'
   echo "  <p>You need to copy and paste this URLs into your RSS client.</p>"
   echo '  <ul>'
   echo "    <li><span>For <b>$category</b> updates: </span><a href=\"/$1/rss.xml\">/$1/rss.xml</a></li>"
   echo "    <li><span>And for <b>all</b> updates: </span><a href=\"/rss.xml\">/rss.xml</a></li>"
   echo '  </ul>'
   echo '  <p>Do you know what this icon is? <img src="/img/rss.png" alt="rss feed" width="16" height="16" /></p>'
   echo '  <p>If not, <a href="https://nperrin.io/tech/why-using-rss-feed.html">learn about RSS feeds here!</a></p>'
   echo '</footer>'
   echo ''
   echo '</html>'
}

for category_file_path in blog/content/*; do
    category="$(basename "$category_file_path")"
    category_index="blog/dist/$category/index.html"
    rm -f "$category_index"
    create_category_index "$category" |xmllint --format - >"$category_index"
done

rm -f /tmp/.blog_category_*
