#!/bin/sh


build() {
    dist_url="$(echo "$1" |sed 's@blog/content/@blog/dist/@; s/\.md/\.html/')"
    show_toc="$(rg -m 1 '^toc\-title:' "$1")"
    lang="$(rg -m 1 '^lang:' "$1" |cut -d ' ' -f 2)"
    category="$(rg -m 1 '^category:' "$1" |cut -d ' ' -f 2)"
    title="$(rg -m 1 '^title:' "$1" |cut -d ' ' -f 2-)"
    description="$(rg -m 1 '^description:' "$1" |cut -d ' ' -f 2-)"
    keywords="$(rg -m 1 '^keywords:' "$1" |cut -d ' ' -f 2-)"

    published="$(rg -m 1 '^published:' "$1" |cut -d ' ' -f 2)"
    [ -n "$published" ] && show_published="$(date -j -f '%Y-%m-%d' '+%B %d of %Y' "$published")"

    type="$(rg -m 1 'type' "$1" |cut -d ' ' -f 2)"
    if [ -z $type ] || [ $type == 'private' ]; then
        dist_url="$(dirname "$dist_url")/$(random_hash).html"
    fi
    web_url="/$(echo "$dist_url" |sed 's@blog/dist/@@')"


    mkdir -p "$(dirname "$dist_url")"


    if [ -n "$lang" ] && [ "$lang" == 'es' ]; then
        published_in='Publicado en'
        written_by='Escrito por'
    else
        published_in='Published in'
        written_by='Written by'
    fi


    metadata_end="$(tail -n +2 "$1" |rg -n -m 1 '\-\-\-' |cut -d ':' -f 1)"
    content_without_metadata="$(tail -n +"$(($metadata_end + 2))" "$1")"


    header="$(sed 's|@url@|'"$web_url"'|g; s|@title@|'"$title"'|g; s|@lang@|'"$lang"'|g; s|@description@|'"$description"'|g; s|@keywords@|'"$keywords"'|g; s|@published@|'"$published"'|g; s|@category@|'"$category"'|g; s|@published_in@|'"$published_in"'|g' blog/parts/header.html)"
    body="$(echo "$content_without_metadata" |pandoc -f markdown -t html --no-highlight)"
    bottom="$(sed 's/@written_by@/'"$written_by"'/' blog/parts/footer.html)"

    echo "$header$body$bottom" |xmllint --format - >"$dist_url"
    echo "[compiled] $title => $web_url"

    echo "# $title ($published)\n\n$description\n\n$content_without_metadata" |lowdown -Tterm >"$(echo "$dist_url" |sed 's/.html$/.term/')"
}


for post in blog/content/*/*.md; do build "$post"; done
