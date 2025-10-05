
const express = require('express');
const bodyParser = require('body-parser');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Relay Bot 起動中: ${client.user.tag}`);
});

// Webhookから受け取るエンドポイント
app.post('/relay', async (req, res) => {
  try {
    const { content } = req.body; // 注文Botから送られる通知文
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    await channel.send(content); // Botアカウントの発言として投稿
    res.sendStatus(200);
  } catch (err) {
    console.error('Relayエラー:', err);
    res.sendStatus(500);
  }
});

client.login(process.env.DISCORD_TOKEN);

// Renderで動かすためのポート
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Relay server running on port ${PORT}`));
