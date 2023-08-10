/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {
  Module
} = require('../main');
const fs = require("fs");
const {
  MODE,
  HANDLERS,
  AUDIO_DATA,
  BOT_INFO,
  settingsMenu
} = require('../config');
const config = require('../config');
const ffmpeg = require('fluent-ffmpeg');
// let parseBotJid = (id) => id+"@s.whatsapp.net";
const {
  getString
} = require('./misc/lang');
const {
  getJson,
  searchYT,
  searchSong
} = require('./misc/misc');
const {
    ytTitle,downloadYT, dlSong, ytv, getResolutions
  } = require('./misc/yt');
const Lang = getString('scrapers');
const {setVar} = require('./manage');
const {
  skbuffer,
  ytdlServer,
  getVideo,
  addInfo
} = require('raganork-bot');
let configs = settingsMenu
var handler = HANDLERS !== 'false'?HANDLERS.split("")[0]:""
let fm = MODE == 'public' ? false : true
const getID = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed|shorts\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/;
Module({
  pattern: 'play ?(.*)',
  fromMe: fm,
  desc: "Play audios from YouTube",
  usage:'.play starboy',
  use: 'download'
}, (async (message, match) => {
if (!match[1]) return message.sendReply("_Need song name, eg: .play starboy_")
let sr = (await searchYT(match[1])).videos[0];
  const title = await ytTitle(sr.id)
  await message.sendReply(`*Downloading:* _${title}_`)
  let sdl = await dlSong(sr.id);
  ffmpeg(sdl)
  .save('./temp/song.mp3')
  .on('end', async () => { 
  var song = await addInfo('./temp/song.mp3',title,BOT_INFO.split(";")[0],"Raganork audio downloader",await skbuffer(`https://i3.ytimg.com/vi/${sr.id}/hqdefault.jpg`))
  return await message.client.sendMessage(message.jid, {
      audio:song,
      mimetype: 'audio/mp4'
  }, {
      quoted: message.data
  });
});
}));
/*

IN CASE IF BUTTONS TO COME BACK!

Module({
  pattern: 'ytv ?(.*)',
  fromMe: fm,
  desc: Lang.YTV_DESC,
  use: 'download'
}, (async (message, match) => {
  if (!match[1]) return message.sendReply("_Need YouTube video link!_")
  if (match[1].startsWith('dl;')){
    const link = match[1].split(';')[2]
    const res_ = match[1].split(';')[1]
    const result__ = await ytv(link,res_)
    const title = await ytTitle(link)
    return await message.client.sendMessage(message.jid,{video:result__,caption:`_${title} *[${res_}]*_`},{quoted:message.data}) 
  }
  var link = match[1].match(/\bhttps?:\/\/\S+/gi)
  if (link !== null && getID.test(link[0])) {
  link = link[0].match(getID)[1]
  var rows = []
  const result_ = await getResolutions(link)
  for (var i of result_){
    rows.push({
      title:i.fps60?i.quality+' 60fps':i.quality,
      description:i.size,
      rowId: handler+"ytv dl;"+(i.fps60?i.quality+'60':i.quality)+';'+link
  })
  }
  const sections = [{
      title:'Select a resolution',
      rows:rows
  }];
  const listMessage = {
      text: " ",
      title: "Select a quality",
      buttonText: "View all",
      sections
  }
 return await message.client.sendMessage(message.jid, listMessage,{quoted: message.data})
}
}));
Module({
  pattern: 'song ?(.*)',
  fromMe: fm,
  desc: Lang.SONG_DESC,
  use: 'download'
}, (async (message, match) => {
  if (!match[1]) return message.sendReply(Lang.NEED_TEXT_SONG)
  var link = match[1].match(/\bhttps?:\/\/\S+/gi)
  if (link !== null && getID.test(link[0])) {
  let v_id = link[0].match(getID)[1]
  const title = await ytTitle(v_id);
  await message.sendReply(`*Downloading:* _${title}_`)
  let sdl = await dlSong(v_id);
  ffmpeg(sdl)
  .save('./temp/song.mp3')
  .on('end', async () => { 
  var song = await addInfo('./temp/song.mp3',title,BOT_INFO.split(";")[0],"Raganork audio downloader",await skbuffer(`https://i3.ytimg.com/vi/${link[0].match(getID)[1]}/hqdefault.jpg`))
  return await message.client.sendMessage(message.jid, {
      audio:song,
      mimetype: 'audio/mp4'
  }, {
      quoted: message.data
  });
 }); 
} else {
  var myid = message.client.user.id.split("@")[0].split(":")[0]
  var sr = await searchYT(match[1]);
  sr = sr.videos.splice(0,21);
  if (sr.length < 1) return await message.sendReply(Lang.NO_RESULT);
  var SongData = []
  for (var i in sr){
    const title = sr[i].title?.text
    if (title){
    SongData.push({
      title,
      description: sr[i].artist,
      rowId: handler+"song https://youtu.be/" + sr[i].id
  })
  }
  }
  const sections = [{
      title: Lang.MATCHING_SONGS,
      rows: SongData
  }];
  const listMessage = {
      text: "and "+(sr.length-1)+" more results..",
      title: sr[0].title.text,
      buttonText: "Select song",
      sections
  }
 return await message.client.sendMessage(message.jid, listMessage,{quoted: message.data})
}
}));

Module({
  pattern: 'yts ?(.*)',
  fromMe: fm,
  desc: "Select and download songs from yt (list)",
  use: 'search'
}, (async (message, match) => {
  if (!match[1]) return message.sendReply("*Need words*")
  var link = match[1].match(/\bhttps?:\/\/\S+/gi)
  if (link !== null && getID.test(link[0])) {
    var {
  info,
  thumbnail
} = await getJson("https://raganork-network.vercel.app/api/youtube/details?video_id=" +link[0].split("/")[3]);
const buttons = [
  {buttonId: handler+'video '+link[0], buttonText: {displayText: '𝗩𝗜𝗗𝗘𝗢'}, type: 1},
  {buttonId: handler+'song '+link[0], buttonText: {displayText: '𝗔𝗨𝗗𝗜𝗢'}, type: 1}
]
const buttonMessage = {
    image: {url: thumbnail},
    caption: info,
    footer: '',
    buttons: buttons,
    headerType: 4
}
return await message.client.sendMessage(message.jid, buttonMessage)
  }
  let sr = await searchYT(match[1]);
  sr = sr.videos;
  if (sr.length < 1) return await message.sendReply("*No results found!*");
  var videos = [];
  for (var index in sr) {
    const title = sr[index].title?.text  
    if (title){
    videos.push({
          title,
          description: sr[index].duration?.text,
          rowId: handler+"yts https://youtu.be/" + sr[index].id
      });
      }  }
  const sections = [{
      title: "YouTube search resulrs",
      rows: videos
  }]
  const listMessage = {
      text: "and " + (sr.length - 1) + " more results...",
      title: sr[0].title.text,
      buttonText: "Select a video",
      sections
  }
  await message.client.sendMessage(message.jid, listMessage,{quoted: message.data})
}));
*/
Module({
  pattern: 'ytv ?(.*)',
  fromMe: fm,
  desc: Lang.YTV_DESC,
  use: 'download'
}, (async (message, match) => {
  if (!match[1]) return message.sendReply("_Need YouTube video link!_")
  if (match[1].startsWith('dl;')){
    const link = match[1].split(';')[2]
    const res_ = match[1].split(';')[1]
    const result__ = await ytv(link,res_)
    const title = await ytTitle(link)
    return await message.client.sendMessage(message.jid,{video:result__,caption:`_${title} *[${res_}]*_`},{quoted:message.data}) 
  }
  var link = match[1].match(/\bhttps?:\/\/\S+/gi)
  if (link !== null && getID.test(link[0])) {
  link = link[0].match(getID)[1]
  var list = `_*Available quality resolutions:*_\n_video_id: ${link}_\n`
  const result_ = await getResolutions(link)
  for (var i in result_){
    list+=`${(parseInt(i)+1)}. _*${result_[i].fps60?result_[i].quality+' 60fps':result_[i].quality} (${result_[i].size})*_\n`
  }
    list+=`\n_Send number as reply to download_`
 return await message.sendReply(list)
}
}));

Module({
  pattern: 'song ?(.*)',
  fromMe: fm,
  desc: Lang.SONG_DESC,
  use: 'download'
}, (async (message, match) => {
  if (!match[1] && !message.reply_message?.text) return message.sendReply(Lang.NEED_TEXT_SONG)
  var link = (match[1] || message.reply_message?.text).match(/\bhttps?:\/\/\S+/gi)
  if (link !== null && getID.test(link[0])) {
  let v_id = link[0].match(getID)[1]
  const title = await ytTitle(v_id);
  await message.sendReply(`*Downloading:* _${title}_`)
  let sdl = await dlSong(v_id);
  ffmpeg(sdl)
  .save('./temp/song.mp3')
  .on('end', async () => { 
  var song = await addInfo('./temp/song.mp3',title,BOT_INFO.split(";")[0],"Raganork audio downloader",await skbuffer(`https://i3.ytimg.com/vi/${link[0].match(getID)[1]}/hqdefault.jpg`))
  return await message.client.sendMessage(message.jid, {
      audio:song,
      mimetype: 'audio/mp4'
  }, {
      quoted: message.data
  });
 }); 
} else {
  var myid = message.client.user.id.split("@")[0].split(":")[0]
  var sr = await searchYT(match[1]);
  sr = sr.videos.splice(0,20);
  if (sr.length < 1) return await message.sendReply(Lang.NO_RESULT);
  var list = `_*Results matching "${match[1]}":*_\n\n` // format using Lang.MATCHING_SONGS
  var _i = 0;
  for (var i in sr){
    const title = sr[i].title?.text
    const dur = sr[i].thumbnail_overlays[0]?.text
    if (title && dur){
      _i++
      list+=`${_i}. *_${title} (${dur})_*\n`
  }
  }
  list+=`\n_Send number as reply to download_`
  return await message.sendReply(list)
}
}));
Module({
  pattern: 'yts ?(.*)',
  fromMe: fm,
  desc: "Select and download songs from yt (list)",
  use: 'search'
}, (async (message, match) => {
  if (!match[1]) return message.sendReply("*Need words*")
  var link = match[1].match(/\bhttps?:\/\/\S+/gi)
  if (link !== null && getID.test(link[0])) {
    var {
  info,
  thumbnail
} = await getJson("https://raganork-network.vercel.app/api/youtube/details?video_id=" +link[0].split("/")[3]);
const Message = {
    image: {url: thumbnail},
    caption: info+`\n\n1. 𝗔𝗨𝗗𝗜𝗢\n2. 𝗩𝗜𝗗𝗘𝗢`
}
return await message.client.sendMessage(message.jid,Message)
  }
  let sr = await searchYT(match[1]);
  sr = sr.videos.splice(0,20);
  if (sr.length < 1) return await message.sendReply("*No results found!*");
  var list = `_*Search results for ${match[1]}:*_\n\n`
  var _i = 0;
  for (var i in sr){
    const title = sr[i].title?.text
    const dur = sr[i].thumbnail_overlays?.[0]?.text
    if (title && dur){
      _i++
      list+=`${_i}. *_${title} (${dur})_*\n`
  }
  }
  list+=`\n_Send number as reply to download_`
  return await message.sendReply(list)
  }));

// Reply listeners:


async function parseReply(reply,no_){
  let YT_BASEURL = "https://youtu.be/{}"
  if (reply?.includes("ᴄʜᴀɴɴᴇʟ")){
    let regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})\b/g;
    let matches = reply.match(regex)
    return matches[0].match(getID)[1]
  }
  if (reply?.includes("Available quality")){
    var query = reply.split("\n").filter(x=>x.startsWith(`${no_}.`))?.[0]?.replace(`${no_}. `,"").trim().replace(/(\*\_|_\*)/g,"")  
    query = (query.replace(query.match(/\([^)]+\)/g)[(query.match(/\([^)]+\)/g)).length-1],"")).trim()
    var videoID = reply.split("\n").filter(x=>x.startsWith(`_video_id`))?.[0]?.split(" ")[1].trim().replace(/_+$/, "");  
    return {res:query,videoID}
  }
  if (reply?.includes("Available quality")){
    var query = reply.split("\n").filter(x=>x.startsWith(`${no_}.`))?.[0]?.replace(`${no_}. `,"").trim().replace(/(\*\_|_\*)/g,"")  
    query = (query.replace(query.match(/\([^)]+\)/g)[(query.match(/\([^)]+\)/g)).length-1],"")).trim()
    var videoID = reply.split("\n").filter(x=>x.startsWith(`_video_id`))?.[0]?.split(" ")[1].trim().replace(/_+$/, "");  
    return {res:query,videoID}
  }
  if (reply?.includes("Subtitles matching")){
    var query = reply.split("\n").filter(x=>x.startsWith(`${no_}.`))?.[0]?.replace(`${no_}. `,"").trim().replace(/(\*\_|_\*)/g,"")  
    return query
  }
  if (reply?.includes("Settings configuration menu")){
    var query = reply.split("\n").filter(x=>x.startsWith(`${no_}.`))?.[0]?.replace(`${no_}. `,"").trim().replace(/(\*\_|_\*)/g,"")  
    return query
  }
  var query = reply.split("\n").filter(x=>x.startsWith(`${no_}.`))?.[0]?.replace(`${no_}. `,"").trim().replace(/(\*\_|_\*)/g,"")
  if (!query) throw "_Invalid number, only 20 results are given!_"
  query = (query.replace(query.match(/\([^)]+\)/g)[(query.match(/\([^)]+\)/g)).length-1],"")).trim()
  var sr = await searchYT(query);
  sr = sr.videos.splice(0,20)
  sr = sr.filter(x=>x.title?.text == (query))[0]
  if (!sr?.id) throw "_No results found!_"
  // let link = YT_BASEURL.format(sr?.id)
  return sr?.id         
  }

Module({
  on: 'text',
  fromMe: fm
  }, (async (message, match) => {
  if (message.reply_message){
    try { 
  let reply = message.reply_message?.text || message.quoted?.message?.imageMessage?.caption;
    if (reply!==undefined && !!reply && (message.quoted.key.id.startsWith("RGNK") || message.quoted.key.id.startsWith("BAE")) && message.quoted.key.participant.includes(message.myjid)){
      let no_ = /\d+/.test(message.message) ? message.message.match(/\d+/)[0] : false
      let onOrOff = (message.message.toLowerCase().includes('on') || message.message.toLowerCase().includes('off')) ? message.message.toLowerCase().trim() : false
      if (onOrOff && message.fromOwner){
        let action = onOrOff == 'on'?'true':'false';
        let set_action = reply.split('\n')[0].replace(/(\*\_|_\*)/g,"")
        if (configs.map(e=>e.title).includes(set_action)){
        let {env_var} = configs.filter(e=>e.title==set_action)[0]
        await message.sendReply(`*${set_action} ${(onOrOff == 'on'?"enabled ✅":"disabled ❌")}*`)
        await setVar(env_var.trim(),action)
      }
      }
      if (!no_) return;
          if (reply?.includes("Search results")){
            let videoID = await parseReply(reply,no_);
            var {
              info,
              thumbnail
            } = await getJson("https://raganork-network.vercel.app/api/youtube/details?video_id=" +videoID);
            const Message = {
                image: {url: thumbnail},
                caption: info+`\n\n1. 𝗔𝗨𝗗𝗜𝗢\n2. 𝗩𝗜𝗗𝗘𝗢`
            }
            return await message.client.sendMessage(message.jid,Message)
            }            
          if (reply?.includes("Settings configuration menu")){
            let item = await parseReply(reply,no_);
            let {env_var} = configs.filter(e=>e.title==item)[0]
            let msgToBeSent = `_*${item}*_\n\n_Current status: ${config[env_var] ?'on':'off'}_\n\n_Reply *on/off*_`;
            return await message.sendReply(msgToBeSent)
            }                        
          if (reply?.includes("Available quality")){
              let {res,videoID} = await parseReply(reply,no_);
              const result__ = await ytv(videoID,res)
              const title = await ytTitle(videoID)
              return await message.client.sendMessage(message.jid,{video:result__,caption:`_${title} *[${res}]*_`},{quoted:message.data}) 
          }
          if (reply?.includes("Subtitles matching")){
              let query = await parseReply(reply,no_);
              let res = (await require("axios")(`https://raganork.tk/api/subtitles?query=${query}`)).data
              if (res.length) res = res.filter(x=>x.title == query)
              res = (await require("axios")(`https://raganork.tk/api/subtitles?query=${res[0].url}`)).data
              if (res.length && !('dl_url' in res)) 
              {
                res = res.filter(x=>x.title == query)
                res = (await require("axios")(`https://raganork.tk/api/subtitles?query=${res[0].url}`)).data
              }
              if ('dl_url' in res) {
                return await message.client.sendMessage(message.jid,{document: {url: res.dl_url},fileName:res.title+'.srt',caption:'_*Here\'s your subtitle file!*_',mimetype:'application/x-subrip'},{quoted:message.data})
              } 
            }
          if (reply?.includes("Results matching")){
            let videoID = await parseReply(reply,no_);
              const title = await ytTitle(videoID);
              await message.sendReply(`*Downloading:* _${title}_`)
              let sdl = await dlSong(videoID);
              ffmpeg(sdl)
              .save('./temp/song.mp3')
              .on('end', async () => { 
              var song = await addInfo('./temp/song.mp3',title,BOT_INFO.split(";")[0],"Raganork audio downloader",await skbuffer(`https://i3.ytimg.com/vi/${videoID}/hqdefault.jpg`))
              return await message.client.sendMessage(message.jid, {
                  audio:song,
                  mimetype: 'audio/mp4'
              }, {
                  quoted: message.data
              });
             }); 
          }
          if (reply?.includes("ᴄʜᴀɴɴᴇʟ")){
            if (no_ == 1){
              let videoID = await parseReply(reply,no_);
              const title = await ytTitle(videoID);
              await message.sendReply(`*Downloading:* _${title}_`)
              let sdl = await dlSong(videoID);
              ffmpeg(sdl)
              .save('./temp/song.mp3')
              .on('end', async () => { 
              var song = await addInfo('./temp/song.mp3',title,BOT_INFO.split(";")[0],"Raganork audio downloader",await skbuffer(`https://i3.ytimg.com/vi/${videoID}/hqdefault.jpg`))
              return await message.client.sendMessage(message.jid, {
                  audio:song,
                  mimetype: 'audio/mp4'
              }, {
                  quoted: message.data
              });
             }); 
            } if (no_ == 2){
              let videoID = await parseReply(reply,no_);
              await message.sendReply("_Downloading video..._")
              const video = await ytv(videoID)
              const caption = "_"+(await ytTitle(videoID))+"_"
              return await message.client.sendMessage(message.jid, {
              video,
              mimetype: "video/mp4",
              caption,
              thumbnail: await skbuffer(`https://i.ytimg.com/vi/${videoID}/hqdefault.jpg`)
        },{quoted:message.data});
            } else throw "_Invalid number, reply 1 for audio and 2 for video_"
          };
        }
       } catch (error) {
          console.log("")
        }  
      }
  }));
