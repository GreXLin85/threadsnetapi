# Threads.net Unofficial API

This is an unofficial API for the website [threads.net](https://www.threads.net/). It is a website like twitter but made by Meta. This API allows you to get information Threads for now. New features will be added soon.

## Installation

```bash
npm install threadsnetapi
```

## Usage

```js
const threads = require('threadsnetapi');

(async () => {
    const threadsAPI = new ThreadsAPI({});

    await threadsAPI.init();

    const thread = await threadsAPI.getThread('thread_id'); // Default value is CuP48CiS5sx you can use it as an example

})();
```
