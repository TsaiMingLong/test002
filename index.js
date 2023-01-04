const line = require("@line/bot-sdk");
const { channel } = require("diagnostics_channel");
const express = require("express");
const fetch = require("node-fetch");
const app = express();
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret
};
const client = new line.Client(config);
app.get("/", (req, res) => {
  res.end("hi!!");
});
const qq = "您說的是";
app.post("/webhook", line.middleware(config), async (req, rep) => {
  console.log(req.body.events[0].message);
  let response = "idk~";
  let { text } = req.body.events[0].message;
  if (text === "W") {
    let url =
      "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-99A62C99-863D-4C47-A093-ED64CE41A549&limit=1&locationName=%E8%8B%97%E6%A0%97%E7%B8%A3";
    let response = await fetch(url);
    let data = await response.json();
    let { weatherElement } = data.recoreds.location[0];
    let [Wx] = weatherElement.map((i) => {
      return i.time[0].parameter.parameterName;
    });
    console.log(Wx);
    response = Wx;
  }
  let msg = {
    type: "text",
    text: response
    //text: qq + req.body.events[0].message.text + "嗎?"
  };
  client.replyMessage(req.body.events[0].replyToken, msg);
  res.end("ok");
});
app.listen(8080);

(async () => {
  let url =
    "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-99A62C99-863D-4C47-A093-ED64CE41A549&limit=1&locationName=%E8%8B%97%E6%A0%97%E7%B8%A3";
  let response = await fetch(url);
  let data = await response.json();
  let { weatherElement } = data.recoreds.location[0];
  let [Wx] = weatherElement.map((i) => {
    return i.time[0].parameter.parameterName;
  });
  console.log(Wx);
})();
