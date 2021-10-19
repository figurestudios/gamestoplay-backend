# gamestoplay-backend
The backend for the digital gameshop built on Akash, Filebase, and Polygon(scan).

## Try it yourself!

Visit http://gamestoplay.hns.to.

You will need:
- Matic on Polygon (Get from [MaticSupply](https://matic.supply/))
- GLM on Polygon (Get from [Thorg](https://www.thorg.io/))
- A Steam Account

## The example

- Clone the repo.

- Get your private keys from [this page on Filebase](https://console.filebase.com/keys).

- Run this command to change CORS settings on your only public bucket: 

`AWS_ACCESS_KEY_ID=<PRIVATEKEY> AWS_SECRET_ACCESS_KEY=<PRIVATESECRET> bucket=<BUCKETNAME> node cors.js`
  
- Add the example files to their respective buckets.

- Deploy the [deploy.yaml] file to Akash after filling out the ENV variables.

- Your backend is now running! Without creating a frontend, it's quite hard to fully test it. If you want to build your own website, you can join the [Discord Server](https://discord.gg/sUmrVjDkKR) and ask for help.

## More links

- [Docker Hub](https://hub.docker.com/r/figureprod/gamestoplay)
- [Discord](https://discord.gg/sUmrVjDkKR)

## How was this made?

If going through the source code doesn't do it for you, then no worries. Everything that's in this project can be boiled down to these parts:
- JavaScript in Node (NodeJS)
- Dockerization & Akash Deployment
- API calls on PolygonScan
- Filebase S3 bucket management ([example](https://github.com/filebase/nodejs-example))
You can read [this guide](https://medium.com/@figuregang/developing-deploying-on-akash-7aecd5d9d467) if you want a step-by-step tutorial that goes through the entire basics of much of the above!
