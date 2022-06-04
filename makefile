build-rss:
	rm -f blog/dist/**/rss.xml
	node ./dist/rss/create-feeds.js

build-blog:
	rm -fr ./blog/dist/*
	./scripts/blog.sh
	./scripts/blog-category-index.sh
	rsync -r blog/static/ blog/dist
	make build-rss

scp-files:
	rsync -azr files/ me:/var/www/files.nperrin.io

scp-blog:
	make build-blog
	rsync -azr blog/dist/ me:/var/www/nperrin.io

scp-books:
	rsync -azr books/ me:/var/www/books.nperrin.io
