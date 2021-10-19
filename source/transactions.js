const request = require("request");
const { upload } = require('./database');
const { read } = require('./database');

async function readTransactions(wallet, cost, orderID, appid){
  read((wallet.toString()+orderID.toString()), process.env.BUCKET_TRANSACTION_DETAILS, async function(response) {
    if (response != "Error!") {
      var order = response;
      request("https://api.polygonscan.com/api?module=account&action=tokentx&contractaddress="+process.env.POLYGON_CONTRACT_ADDRESS+"&address="+process.env.POLYGON_WALLET+"&page=1&offset=20&sort=desc&apikey="+process.env.POLYGONSCAN_API_KEY, async (error, response, body) => {
        var parsedBody = JSON.parse(body);
        for (let i = 0; i < parsedBody['result'].length; i++) {
            if(parsedBody['result'][i]['from'] == wallet.toLowerCase() && parsedBody['result'][i]['to'] == process.env.POLYGON_WALLET.toLowerCase() && parseFloat(parsedBody['result'][i]['value'])*1.1 >= parseFloat(cost)) {
              if (JSON.parse(order)['hasPaid'] == false) {
                read(parsedBody['result'][i]['hash'], process.env.BUCKET_TRANSACTION_BACKUPS, async function (keyList) {
                  if (keyList == "Error!") {
                    upload(process.env.BUCKET_TRANSACTION_BACKUPS, parsedBody['result'][i]['hash'], "has been used");
                    read((appid.toString() + ".json"), process.env.BUCKET_PRODUCT_KEYS, async function(keyList) {
                      if (keyList != "Error!") {

                        var data = JSON.parse(keyList);
                        //also check for correct cost
                        var game = data['gameList'][0]['code'];
                        if (data['gameList'].length <= 1) {
                          //remove stock completely
                          read("games.json", process.env.BUCKET_PUBLIC_RESOURCES, async function (gameList) {
                            if (gameList != "Error!") {
                              for (i = 0; i < JSON.parse(gameList)['gameList'].length; i++) {
                                if (JSON.parse(gameList)['gameList'][i]['appID'] == appid) {
                                  gameList = JSON.parse(gameList)['gameList'][i]['stock'] = 0;
                                  upload(process.env.BUCKET_PUBLIC_RESOURCES, "games.json", JSON.stringify(gameList));
                                }
                              }
                            }
                          });
                        } else { //removes used cd key
                          data['gameList'].splice(0,1);
                          upload(process.env.BUCKET_PRODUCT_KEYS, (appid.toString() + ".json"), JSON.stringify(data));
                        }
                        let newOrder = {
                          orderID: order.orderID,
                          wallet: order.wallet,
                          cdkey: game,
                          cost: order.cost,
                          hasPaid: true
                        }
                        upload(process.env.BUCKET_TRANSACTION_DETAILS, (wallet.toString() + orderID.toString()), JSON.stringify(newOrder));
                      }
                    });
                  }
                });
              };
            }
          }
      });
    };
  });
}

module.exports.readTransactions = readTransactions;