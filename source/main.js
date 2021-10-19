const cors = require('cors');
const express = require('express');

const { upload } = require('./database')
const { readTransactions } = require('./transactions')
const { read } = require('./database');

const app = express()
const port = 3000; //internal port within docker

app.use(cors());

app.get('/retrievegame/:wallet/:cost/:orderID/:appID', async function(req, res, next) {
  read((req.params['wallet'].toString() + req.params['orderID'].toString()), process.env.BUCKET_TRANSACTION_DETAILS, async function(response) {
    if (response.toString() != "Error!") {
      if (JSON.parse(response)['cdkey'] != null){
        res.send(JSON.parse(response)['cdkey']);
      } else {
        console.log("CD-Key is null ... Skipping");
      }
      console.log("Sent data to order " + req.params['orderID']);
    } else {
      console.log("Error getting order " + req.params['orderID']);
    }
  });
  readTransactions(req.params['wallet'], req.params['cost'], req.params['orderID'], req.params['appID']);
});

app.get('/order/:wallet/:appid', async function(req, res, next) {
  read(req.params['wallet'].toString(), process.env.BUCKET_ACTIVE_ORDERS, async function (timestamp) {
    if (timestamp != "Error!") {
      if (parseFloat(timestamp) + 300 < (Number(new Date())/1000)) {
        upload(process.env.BUCKET_ACTIVE_ORDERS, req.params['wallet'].toString(), ((Number(new Date()))/1000).toString())
        const exp = 5;
        var random = 0;
        while (random <= 10000 || random == 100000) {
            random = 0;
            random = (Math.floor(Math.random(0, 1) * 10 ** exp));
        }
        var price = 0;
        read("games.json", process.env.BUCKET_PUBLIC_RESOURCES, async function (gameList) {
          if (gameList != "Error!") {
            gameList = JSON.parse(gameList);
            for (i = 0; i < gameList['gameList'].length; i++) {
              if (gameList['gameList'][i]['appID'].toString() == req.params['appid'].toString()) {
                price = parseFloat(gameList['gameList'][i]['price']);
                let response = { 
                  orderID: random,
                  wallet: process.env.POLYGON_WALLET,
                  cost: price, //displays like this cost*10**(-18) as there is 18 digits precision on GLM - this varies from coin to coin, though
                };
                let order = {
                  orderID: random,
                  wallet: req.params['wallet'],
                  cdkey: null,
                  cost: price*10**(-18), //DYNAMIC COSTS NEEDED
                  hasPaid: false
                };
                upload(process.env.BUCKET_TRANSACTION_DETAILS,(req.params.wallet.toString() + response.orderID.toString()), JSON.stringify(order));
                res.send(response);
                console.log("Returned orderID " + response.orderID);
              }
            }
          }
        });
      } else {
        console.log("Trying to soon ...");
        res.send("Error! Trying to soon - only one transaction per wallet per 5 minutes allowed");
      }
    } else {
      upload(process.env.BUCKET_ACTIVE_ORDERS, req.params['wallet'].toString(), ((Number(new Date()))/1000).toString())
      const exp = 5;
      var random = 0;
      while (random <= 10000 || random == 100000) {
          random = 0;
          random = (Math.floor(Math.random(0, 1) * 10 ** exp));
      }
      var price = 0;
      read("games.json", process.env.BUCKET_PUBLIC_RESOURCES, async function (gameList) {
        if (gameList != "Error!") {
          gameList = JSON.parse(gameList);
          for (i = 0; i < gameList['gameList'].length; i++) {
            if (gameList['gameList'][i]['appID'].toString() == req.params['appid'].toString()) {
              price = parseFloat(gameList['gameList'][i]['price']);
              let response = { 
                orderID: random,
                wallet: process.env.POLYGON_WALLET,
                cost: price, //displays like this cost*10**(-18) as there is 18 digits precision on GLM - this varies from coin to coin, though
              };
              let order = {
                orderID: random,
                wallet: req.params['wallet'],
                cdkey: null,
                cost: price*10**(-18),
                hasPaid: false
              };
              upload(process.env.BUCKET_TRANSACTION_DETAILS,(req.params.wallet.toString() + response.orderID.toString()), JSON.stringify(order));
              res.send(response);
              console.log("Returned orderID " + response.orderID);
            }
          }
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is active`);
});
