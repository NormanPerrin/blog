default: scp-blog

clear:
	rm -fr ./blog/dist/*

build-rss:
	node ./dist/rss/create-feeds.js

build-indexes:
	node ./dist/list-posts/list-posts.js

build-posts:
	node ./dist/build-posts/build-posts.js

build-comments:
	node ./dist/build-comments/build.js

build-blog:
	make clear
	npm run build
	make build-posts
	make build-indexes
	make build-comments
	rsync -r blog/static/ blog/dist
	make build-rss

scp-files:
	rsync -azr files/ me:/var/www/files.nperrin.io

scp-blog:
	ssh me 'rm -fr /var/www/nperrin.io/*'
	make build-blog
	make scp-comments
	rsync -azr blog/dist/ me:/var/www/nperrin.io

scp-comments:
	rsync -azr comments/*.html me:/home/rex/comments
	scp ./comments/possible-response-to.txt me:/home/rex/comments/

dev:
	npm run build
	node dist/server/app.js

build-server:
	npm run build

scp-server:
	make build-server
	ssh me 'rm -fr /home/rex/server'
	scp -r ./dist/server me:/home/rex/server

download-comments:
	scp me:/home/rex/comments/comments.json ./comments/comments.json
