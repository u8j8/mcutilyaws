import { Server, ServerEvent , World} from 'socket-be';
import fs from "fs"
import { config } from "dotenv"
/*
探すの苦手だからコメント繰り返してる、すまそ!
*/

// config define
// config define
// config define
// config define
// config define

config()
let token = process.env["TOKEN"]
let discordto = process.env["DISCORD"]
let port_ = process.env["PORT"]
let cur_playercount
let clients = null
let ev = null
let latestInput = '';
let playerList = []

// discord
// discord
// discord
// discord
// discord

async function sendWebhook(arg1 = "someting wrong") {
  try {
    const response = await fetch(token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username:"minecraft util",content: arg1}),
    });
    if (response.ok) {
    } else {
      console.error('err_wh:', response.statusText);
    }
  } catch (error) {
    console.error('err_wh:', error);
  }
}

// console
// console
// console
// console
// console

const clearLine = () => {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
};
function writeLog(msg) {
  process.stdout.write('\r\x1b[K');
  console.log(msg);
  process.stdout.write('> ');
}
const stdin = process.openStdin();
process.stdout.write('> ');
stdin.addListener('data', async (d) => {
  let latestInput = d.toString().trim();
  try {
    const res = await sv.broadcastCommand(latestInput);
    writeLog(res)
  } catch (err) {
    writeLog(`err: ${err.message}`);
  }
});




// serverinit
const sv = new Server({ port: port_ });

sv.on(ServerEvent.Open, () => {
  writeLog(`Start server on ${port_}`);
});
sv.on(ServerEvent.WorldAdd, async (event) => {

  console.log('World added', event.world.connection.identifier);

  sv.on(ServerEvent.WorldInitialize, async (event) => {
    try {
      const res = await sv.broadcastCommand('listd');
      const data = res[0]; 
      if (data && data.statusMessage) {
        const match = data.statusMessage.match(/There are (\d+)\//)
        cur_playercount = Number(match[1])
        playerList.unshift(res[0]["players"])
      }
      console.log("Sync Runned: (", playerList.length, "):", playerList," task complete.")
    }catch(err){console.log("Sync Err: ",err)}
    console.log('World initialized:', event.localPlayer.name);

  });

});

sv.on(ServerEvent.PlayerChat, async (ev) => {
  const { sender, message, world } = ev;
  sendWebhook(`<${sender.name??"err"}> ${message}`)
  writeLog(`<${sender.name}> ${message}`);
});
sv.on(ServerEvent.PlayerJoin, (ev) => {
  writeLog(`${ev.player.name} joined the game`);
  playerList.unshift(ev.player.name)
  sendWebhook(`プレイヤーが参加しました: ${ev.player.name}(現在人数:${playerList.length})`)
});
sv.on(ServerEvent.PlayerLeave, (ev) => {
  writeLog(`${ev.player.name} left the game`);
  playerList = playerList.filter(item => item !== ev.player.name);
  sendWebhook(`プレイヤーが退出しました: ${ev.player.name}(現在人数:${playerList.length})`)
});