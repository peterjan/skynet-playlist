# skynet-playlist
Build your video playlist and share it

## Skynet Dapp URL
https://siasky.net/vADu8cjAiHknBTIkVWHV3eyGkLS0isLID1nkhjCgpRkaDg

## Demo Video
https://siasky.net/AACh0SDbRqPJEhgxqP-bzmU1YhRcI29AZo4G0u-xcmuJWg

## Build the HTML
In order to build the html you can use the npm package `inliner`.
Just run the following commands and you will end up with a `dist.html` that
contains everything which you can then upload to Skynet.

```
npm install -g inliner
cat index.html | inliner > dist.html
```