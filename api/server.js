const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const request = require("request");
const config = require("./config");
const uuid = require("uuid/v1");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const adapter = new FileSync("db.json");
const db = low(adapter);
db
  .defaults({
    searchHistory: []
  })
  .write();

app.post("/authorize", function(req, res) {
  var header = config.consumerkey + ":" + config.consumersecret;
  var encheader = new Buffer(header).toString("base64");
  var finalheader = "Basic " + encheader;

  request.post(
    "https://api.twitter.com/oauth2/token",
    {
      form: { grant_type: "client_credentials" },
      headers: { Authorization: finalheader }
    },
    function(error, response, body) {
      if (error) console.log(error);
      else {
        config.bearertoken = JSON.parse(body).access_token;

        res.json({ success: true, data: config.bearertoken });
      }
    }
  );
});

app.post("/search", function(req, res) {
  var searchquery = req.body.query;
  var encsearchquery = encodeURIComponent('#' + searchquery);
  var bearerheader = "Bearer " + config.bearertoken;

  request.get(
    "https://api.twitter.com/1.1/search/tweets.json?q=" +
      encsearchquery +
      "&result_type=recent",
    { headers: { Authorization: bearerheader } },
    function(error, body, response) {
      if (error) console.log(error);
      else {
        const duplicateQuery = db
          .get("searchHistory")
          .find({
            searchquery: searchquery
          })
          .value();

        if (duplicateQuery) {
          db
            .get("searchHistory")
            .remove({ id: duplicateQuery.id })
            .write();
        }
        db
          .get("searchHistory")
          .push({
            id: uuid(),
            searchquery: searchquery
          })
          .write();
        res.json({ success: true, data: JSON.parse(body.body) });
      }
    }
  );
});

app.get("/history", function(req, res) {
  const historyList = db.get("searchHistory").value();
  res.json({ success: true, data: historyList });
});

app.listen(3000);
