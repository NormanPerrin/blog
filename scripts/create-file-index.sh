#!/bin/sh


directories="$(fd -d 1 -t d . $1 |sed s@files@@ |sed -E 's@(.*)@		<li><a href="\1">\1</a></li>@')"
files="$(fd -d 1 -t f . $1 |sed s@files@@ |sed -E 's@(.*)@		<li><a href="\1">\1</a></li>@')"
title="$(basename "$1" |sed s/files/home/)"

output="
<!DOCTYPE html>
<html xmlns=\"http://www.w3.org/1999/xhtml\" lang=\"en-us\" xml:lang=\"en-us\">
<title>$title</title>
<meta charset=\"utf-8\" />
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=yes\" />
<meta name=\"description\" content=\"Directory list for $title\" />

<main>
<h1>$title</h1>

<nav>
<h2>Files</h2>
<ul>$files</ul>
"


if [ ! -z "$directories" ]; then
	output+="<h2>Directories</h2><ul>$directories</ul>"
fi

output+='</nav></main></html>'

echo "$output" |xmllint --format - >"$1/index.html"
