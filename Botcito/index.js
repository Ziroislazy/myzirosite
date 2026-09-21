const axios = require("axios");

require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/el-botcito-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `What's up/Que onda papu\nLatency: ${latency}ms` });
});


app.command("/el-botcito-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/el-botcito-ping - Check bot latency
/el-botcito-catfact - Get a cat fact`

  });
});

app.command("/el-botcito-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact :3 :\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/el-botcito-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
}); 

app.command("/el-botcito-randomcat", async ({ ack, respond }) => {
  await ack();

  try { 
    const randomUrl = `https://cataas.com/cat?ts=${Date.now()}`;

    await respond ({

        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "Here's a random cat for you!"
                }
            },

            {
                type: "image",
                image_url: randomUrl,
                alt_text: "Random Cat"
            }
        ]
  });

} catch (err) {
    console.error(err);
    await respond ({text: "Failed to fetch a random cat :("});
}

});

app.command('/el-botcito-dogfact', async ({ack, respond}) => {
 await ack();

  try { 
    const response = await axios.get("https://dogapi.dog/api/v2/facts?limit=1");
    const dogFact = response.data.data[0].attributes.body;
    await respond ({ text: `Dog Fact :3 :\n${dogFact}` });
  } 
  catch (err) {
    await respond({ text: "Failed to fetch a dog fact." });
  }

});


(async () => {
  await app.start();
  console.log("bot is running!");
})();
