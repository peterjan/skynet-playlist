# skynet-playlist
Build your video playlist and share it

## Skynet Dapp URL
https://siasky.net/nAAJroJW0Z7cYcpev1VVjJXXGU1WF8YQ8eUs8dJHTDEXqQ

## Demo Video
https://siasky.net/AABSR21FcA-YmenaD-NvOb727LrVDAsEw_Bz1r4HxglcIQ

## Build the HTML
In order to build the html you can use the npm package `inliner`.
Just run the following commands and you will end up with a `dist.html` that
contains everything which you can then upload to Skynet.

```
npm install -g inliner
cat index.html | inliner > dist.html
```