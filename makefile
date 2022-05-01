build-rss:
	rm -f blog/dist/**/rss.xml
	fd -t d -d 1 . blog/content -x ./scripts/rss.sh {} \;
	./scripts/rss.sh blog/content/

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

scp-habits:
	rsync -azr habits/ me:/var/www/habits.nperrin.io

scp-books:
	rsync -azr books/ me:/var/www/books.nperrin.io
