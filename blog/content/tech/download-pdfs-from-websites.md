---
title: Download PDFs from websites
description: Things I've learned trying to download websites as PDFs
published: 2019-12-10
category: tech
type: public
---

From the site is very straightforward. You just right click, print, and save as PDF. And that's all the story there.

If you want to automate or get a PDF from a cli, then is a different.

You have [puppeteer](https://developers.google.com/web/tools/puppeteer/), the first tool I've used for downloading pdfs, as I was somewhat familiared with it. The thing was that I had to run a chrome instance, and wanted a lighter and simpler solution.

One thing I loved about downloading a PDF directly from the website, is that it let you respect the `@media print` query on css. So I'd avoid the unnecesary information, like sidebars, headers, ... Instead, I'd only had the content as pdf, with the styles of the site. Awesome!

So now that I'm using [pandoc](https://pandoc.org/), I want to use something like that to download the content from a website.

```bash
$ pandoc http://localhost:8000/posts/why-using-rss-feed.html -o out.pdf
```

Not so fast.

It throws me an error to install a pdf engine. Fair enough.

## default --pdf-engine

On [pandoc](https://pandoc.org/) you have to download a pdf engine to be able to convert the html to pdf. It doens't come up installed. So I downloaded [MacTex](https://tug.org/mactex/) (latex for mac or something like that).

Then I run the command:

```bash
$ pandoc http://localhost:8000/posts/why-using-rss-feed.html -o out.pdf
```

And it works! It was fast but...

It didn't include the styles nor respect the `@media print` query to avoid unnecessary content.

Ok, lets try something else.

## prince

Searching for a way include the styles on my downloads, I encounter [prince](https://www.princexml.com/). Simple to install and very straight forward on how to use it:

```bash
$ prince http://localhost:8000/posts/why-using-rss-feed.html --page-margin=10mm -o out.pdf
```
The output is as expected. It includes the styles and excludes the unnecessary content according to the `@media print` query. Awesome.

But there are a couple of things I don't like.

1. Not completely free to use. Buying a license costs 500 dollars for 1 user on a desktop 🙃.
2. It adds an ugly logo on the pdf.
3. It doesn't recognize css grid styles.
4. I had to install another program.

So I kept searching, and I remembered that with [pandoc](https://pandoc.org/) I had other pdf engine options.

## wkhtmltopdf

That's a real name.

Looking at the [wkhtmltopdf config options for pandoc](https://pandoc.org/MANUAL.html#variables-for-wkhtmltopdf) it lets you add `--css` to specify the css file. Great! The thing is that I needed to make a local reference to that file... I couldn't reference it with `http`. But I can always `curl` and then run the command. Ok, another step, but nothing to crazy.

So I installed [wkhtmltopdf](https://wkhtmltopdf.org/) from their site, and worked well:

```bash
$ curl http://localhost:8000/css/styles.css > styles.css
$ pandoc http://localhost:8000/posts/why-using-rss-feed.html --pdf-engine wkhtmltopdf --css styles.css -V margin-left=10 -V margin-top=10 -V margin-right=10 -V margin-bottom=10 -o out.pdf
```

Something to consider is that I had to specified to margins of every side for it to look ok, so the command got bigger.

The output was ok, it didn't consider the css grid property but as with [prince](https://www.princexml.com/), specifying a margin was enought.

The last thing that was bothering me about this was that it keep including the extra info hidden by the `print` media query...

Looking at the [wkhtmltopdf](https://wkhtmltopdf.org/) config, it specifies that you can give a `--print-media-type` option to make it load with the `print` media query.

I tried to use it from [pandoc](https://pandoc.org/) but didn't work, so I saw to use [wkhtmltopdf](https://wkhtmltopdf.org/) direclty...

```bash
$ wkhtmltopdf http://localhost:8000/posts/why-using-rss-feed.html --print-media-type out.pdf
```

Wow. Much more simple than using [wkhtmltopdf](https://wkhtmltopdf.org/) though [pandoc](https://pandoc.org/), who would say?

And I have all the things I want! The same output as [prince](https://www.princexml.com/) but without paying 500 dolars.

## Conclution

One thing I've learned with this, is to use the tools in the a more direct way, not though another tools that may limit the inferface. Like with [pandoc](https://pandoc.org/) and [wkhtmltopdf](https://wkhtmltopdf.org/).

And thats it. Now that I've figured out how to download websites as PDFs in a simple way, I'll probably automate something for myself.

I recommend that if you're going to use [wkhtmltopdf](https://wkhtmltopdf.org/) make an alias or script with a better name.

Have a good reading!
