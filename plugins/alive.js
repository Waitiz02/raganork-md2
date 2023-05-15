/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {
  FancyRandom,
  getListFromCommand,
  skbuffer
} = require("raganork-bot");
const {
  Module,
  commands
} = require('../main')
const {
  MODE,
  ALIVE,
  BOT_INFO
} = require('../config');
const config = require('../config');
const {
  parseAlive
} = require('./misc/misc');
let w = MODE == 'public' ? false : true
var _0x2812ed=_0x3677;function _0x3677(_0x476363,_0x2b3418){var _0x2fbb31=_0x2fbb();return _0x3677=function(_0x367719,_0x2e5f11){_0x367719=_0x367719-0x8e;var _0x461eb7=_0x2fbb31[_0x367719];return _0x461eb7;},_0x3677(_0x476363,_0x2b3418);}(function(_0x244758,_0x1e3593){var _0xe8f516=_0x3677,_0x10f50a=_0x244758();while(!![]){try{var _0x74d44f=-parseInt(_0xe8f516(0x9f))/0x1*(-parseInt(_0xe8f516(0x9a))/0x2)+-parseInt(_0xe8f516(0x9c))/0x3+-parseInt(_0xe8f516(0x99))/0x4+parseInt(_0xe8f516(0x97))/0x5*(-parseInt(_0xe8f516(0xa2))/0x6)+parseInt(_0xe8f516(0xa1))/0x7+-parseInt(_0xe8f516(0x8f))/0x8+-parseInt(_0xe8f516(0x9e))/0x9*(-parseInt(_0xe8f516(0x9d))/0xa);if(_0x74d44f===_0x1e3593)break;else _0x10f50a['push'](_0x10f50a['shift']());}catch(_0x5b85be){_0x10f50a['push'](_0x10f50a['shift']());}}}(_0x2fbb,0xbd9d9));var os=require('os');const { lchown } = require("fs");
const {spawnSync}=require(_0x2812ed(0x93)+_0x2812ed(0x90)+'pro'+_0x2812ed(0xa0)+'s'),child=spawnSync(_0x2812ed(0x95)+'fet'+'ch',[_0x2812ed(0x92)+_0x2812ed(0xa3)+'ut']);function bytesToSize(_0x42c818){var _0x55538a=_0x2812ed,_0x4fc952=[_0x55538a(0x9b)+'es','KB','MB','GB','TB'];if(_0x42c818==0x0)return'0\x20B'+'yte';var _0x1aa1c3=parseInt(Math['flo'+'or'](Math['log'](_0x42c818)/Math['log'](0x400)));return Math[_0x55538a(0x94)+'nd'](_0x42c818/Math[_0x55538a(0x8e)](0x400,_0x1aa1c3),0x2)+'\x20'+_0x4fc952[_0x1aa1c3];}var used=bytesToSize(os[_0x2812ed(0x96)+_0x2812ed(0x91)+'m']()),total=bytesToSize(os['tot'+_0x2812ed(0x98)+'em']());function _0x2fbb(){var _0xf10c15=['4304672KxZanY','5984IOOiuh','Byt','1824645uDmejr','3790EcSgQu','65763koNUnW','472SVmexJ','ces','3146514uYYRqZ','6ObUbhJ','tdo','pow','8408080LpvaFi','ld_','eme','--s','chi','rou','neo','fre','5595105XPsOXl','alm'];_0x2fbb=function(){return _0xf10c15;};return _0x2fbb();}
Module({
  pattern: 'menu',
  fromMe: w,
  use: 'utility',
  desc: 'Is bot alive?'
}, (async (message, match) => {
  var myid = message.client.user.id.split(":")[0]
  const stars = ['✦','✯','✯','✰','◬','✵'];
  const star = stars[Math.floor(Math.random()*stars.length)];
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
    }    
  let use_ = commands.map(e=>e.use)
  const others = (use) => { return use == '' ? 'others' : use}
  let types = shuffleArray(use_.filter((item,index) => use_.indexOf(item) === index).map(others))
  var cmd_obj = {}
  for (var command of commands){
    let type_det = types.includes(command.use)?command.use:"others";
    if (!cmd_obj[type_det]?.length) cmd_obj[type_det] = []
    let cmd_name = command.pattern?.toString().match(/(\W*)([A-Za-z1234567890 ]*)/)[2]
    if (cmd_name) cmd_obj[type_det].push(cmd_name)
  }
  let final = ''
  var i = 0;
  for (var n of types){
    for (var x of cmd_obj[n]){
        i=i+1
        var newn = n.charAt(0).toUpperCase()+n.replace(n.charAt(0),"")
        final+=`${final.includes(newn)?'':'\n\n╭════〘 *_'+newn+"_* 〙════⊷❍\n"}\n┃${star}│ _${i}. ${x.trim()}_${cmd_obj[n]?.indexOf(x)===(cmd_obj[n]?.length-1) ?`\n┃${star}╰─────────────────❍\n╰══════════════════⊷❍`:''}`
    }
  } 
  let cmdmenu = final.trim();
  var menu = `╭═══〘 ${BOT_INFO.split(";")[0]} 〙═══⊷❍
┃${star}╭──────────────
┃${star}│
┃${star}│ _*Owner*_ : ${BOT_INFO.split(";")[1]}
┃${star}│ _*User*_ : ${message.senderName.replace( /[\r\n]+/gm, "" )}
┃${star}│ _*Mode*_ : ${MODE}
┃${star}│ _*Server*_ : ${__dirname.startsWith('/skl')?"Heroku":"Private (VPS)"}
┃${star}│ _*Available RAM*_ : ${used} of ${total}
┃${star}│ _*Version*_ : ${config.VERSION}
┃${star}│
┃${star}│
┃${star}│  ▎▍▌▌▉▏▎▌▉▐▏▌▎
┃${star}│  ▎▍▌▌▉▏▎▌▉▐▏▌▎
┃${star}│   ${BOT_INFO.split(";")[0]}
┃${star}│ 
┃${star}╰───────────────
╰═════════════════⊷

${cmdmenu}`
try {
  var _img = await skbuffer(BOT_INFO.split(";")[3]||`https://picsum.photos/800/500`)
} catch (error) {
  var _img = await skbuffer(`https://i.imgur.com/B2YWSLk.jpg`)
}
return await message.client.sendMessage(message.jid,{
  image: await skbuffer(BOT_INFO.split(";")[3]||`https://picsum.photos/800/500`),
  caption: FancyRandom(menu)
})
}))
Module({
  pattern: 'alive',
  fromMe: w,
  desc: 'Is bot alive?'
}, (async (message, match) => {
  await parseAlive(message, ALIVE)
}))
Module({
  pattern: 'alive ?(.*)',
  fromMe: true,
  dontAddCommandList: true
}, (async (message, match) => {
if (match[1]){
  return await require('./manage').setVar("ALIVE",match[1],message)
}
}))
Module({
  on: 'button',
  fromMe: w,
 }, (async (message, match) => {
var myid = message.client.user.id.split(":")[0]
var {button} = message
if (button) {
  if (button.includes(myid)&&button.startsWith("commands")) return await message.sendReply(FancyRandom(await getListFromCommand(commands)))
  if (button.includes(myid)&&button.startsWith("ping")) {
    const start = new Date().getTime()
    await message.client.sendMessage(message.jid, {
        text: FancyRandom('Ping!')
    })
    const end = new Date().getTime()
    await message.sendReply(FancyRandom('Pong!\n ```' + (end - start) + '``` *ms*')) 
  }
  if (button.includes(myid)&&button.startsWith("support")) return await message.sendReply(BOT_INFO.split(";")[4])
} 
}))
Module({
  pattern: 'ping',
  fromMe: w,
  use: 'utility',
  desc: 'Measures ping'
}, (async (message, match) => {
  const start = new Date().getTime()
  let sent_msg = await message.sendReply('*❮ ᴛᴇsᴛɪɴɢ ᴘɪɴɢ ❯*')
  const end = new Date().getTime()
  await message.edit('*ʟᴀᴛᴇɴᴄʏ: ' + (end - start) + ' _ᴍs_*',message.jid,sent_msg.key)
}));
Module({
  pattern: 'uptime',
  fromMe: w,
  use: 'utility',
  desc: 'Shows system (OS) /process uptime'
}, (async (message, match) => {
  var ut_sec = require("os").uptime(); 
  var ut_min = ut_sec/60; 
  var ut_hour = ut_min/60; 
  ut_sec = Math.floor(ut_sec); 
  ut_min = Math.floor(ut_min); 
  ut_hour = Math.floor(ut_hour); 
  ut_hour = ut_hour%60; 
  ut_min = ut_min%60; 
  ut_sec = ut_sec%60; 
  var uptime_os = (`_System (OS) : ${ut_hour} Hour(s), ${ut_min} minute(s) and ${ut_sec} second(s)_`)  
  var sec_num = parseInt(process.uptime(), 10);
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);
  var uptime_process = (`_Process : ${hours} Hour(s), ${minutes} minute(s) and ${seconds} second(s)_`)  
  return await message.sendReply(`                 _*[ UP-TIME ]*_\n\n${uptime_os}\n${uptime_process}`);
}));
