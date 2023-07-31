# Notiondipity

Notiondipity is a browser extension for exploiting connections between [Notion](https://notion.so) pages. 
It provides the following features:

- Recommending pages similar to the currently open Notion page
- Semantic search based on the semantic similarity between the query and Notion pages
- Generating project ideas from the current page and up to 2 most similar pages

You can download the extension from 
[Chrome Web Store](https://chrome.google.com/webstore/detail/notiondipity/fbbjmpeddaliljeidpmgchbgdfpjglok) 
or [Firefox Add-Ons](https://addons.mozilla.org/en-US/firefox/addon/notiondipity/).

To find similar pages, Notiondipity uses 
[text-embedding-ada-002](https://platform.openai.com/docs/guides/embeddings)
embeddings from OpenAI. Cosine distance between page embeddings is used as a similarity metric. 
The [gpt-3.5-turbo](https://platform.openai.com/docs/models/gpt-3-5) model is used to generate
project ideas.

## Backend

The extension has a backend hosted at https://notiondipity-backend.fly.dev/. It facilitates communication between
the extension and the [Notion API](https://developers.notion.com/). Notion API does not support cross-site requests, so it
can't be used directly from a browser. The backend is responsible for calculating all page embeddings and finding
most similar pages. It uses a PostgreSQL database to store the following information:

- SHA256 hash of the unique Notion user ID
- embedding of each Notion page
- the title of each Notion page
- encrypted contents of each Notion page

We use https://fly.io/ to host the backend. There are no other third parties with access to this data.

## Authentication

To use the extension and get page recommendations you need to authenticate with your Notion account. Your access token
is stored only locally in your browser and is sent to the backend with each request. The backend itself does not
store the access token.

## Building the extension from source

To build the extension from source you need to have `node.js` and `npm` installed on your system. Then you have 
to install all dependencies, e.g.:

```shell
$ cd notiondipity-extension
$ npm install
```

You can then run one of the following build commands:

```shell
$ TARGET=firefox npm run build-prod
$ TARGET=chrome npm run build-prod
$ TARGET=firefox npm run build-dev
$ TARGET=chrome npm run build-dev
```

As you might have guessed, the `TARGET` environment variable determines the target browser. You can also choose 
to build for production or for development, the only difference currently being the backend URL. The development
build sets http://localhost:5001/ as backend URL referring to a local development backend instance.

The extension build can be found in the `dist/` directory and has takes the form of an unpacked extension.
The build process was tested on Fedora 37, Fedora 38 and macOS Ventura.