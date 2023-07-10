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
    const threadsAPI = new ThreadsAPI({
        headless: true, // Default value is false,
        proxy: {
            server: "socks5://myproxy.com:3128"  // This is an example, you can use any proxy server, but its not required
        }
    });

    await threadsAPI.init();

    const thread = await threadsAPI.getThread('thread_id'); // Default value is CuP48CiS5sx you can use it as an example

    /** Output
     * {
     *    id: 'thread_id',
     *    content: 'thread_content',
     *    user: "@username",
     *    whenShared: Date,
     *    repliesCount: Number,
     *    likesCount: Number,
     * }
     */
    
    const user = await threadsAPI.getUser('username'); // Default value is zuck you can use it as an example

    /** Output
     * {
     *    id: 'user_id',
     *    name: 'name',
     *    username: '@username',
     *    profilePicture: 'user_profile_picture_url',
     *    bio: 'user_bio',
     *    followersCount: Number,
     *    instagramAccount: "@instagram_account",
     * }
     */


    await threadsAPI.close(); // You should close the browser when you are done
})();
```
