let fetch = require('node-fetch')
let { JSDOM } = require('jsdom')
const Innertube = require('youtubei.js');

async function dlSong(vid){
const yt = await new Innertube({ gl: 'US' });
const audinfo = await yt.getStreamingData(vid, {type:"audio"});
let audioUrl = audinfo.selected_format.url
let abuffer = await require("raganork-bot").skbuffer(audioUrl)
let audioTo = "./temp/song.mp3"
await require("fs").writeFileSync(audioTo, abuffer)
return audioTo;
}

async function downloadYT(vid,type = 'video',quality = '360p'){
 try { 
var result = (await require("axios")(`https://y2mate.souravkl11.xyz/get?vid=${vid}&type=${type}&resolution=${quality}`)).data
if (!result.url) result = (await require("axios")(`https://y2mate.souravkl11.xyz/get?vid=${vid}&type=${type}&resolution=${quality}`)).data
if (!result.url) result = (await require("axios")(`https://y2mate.souravkl11.xyz/get?vid=${vid}&type=${type}&resolution=${quality}`)).data
} catch {
var result = (await require("axios")(`https://y2mate-2.souravkl11.xyz/get?vid=${vid}&type=${type}&resolution=${quality}`)).data
if (!result.url) result = (await require("axios")(`https://y2mate-2.souravkl11.xyz/get?vid=${vid}&type=${type}&resolution=${quality}`)).data
if (!result.url) result = (await require("axios")(`https://y2mate-2.souravkl11.xyz/get?vid=${vid}&type=${type}&resolution=${quality}`)).data
} 
return result 
}
module.exports = {
  dlSong ,
  downloadYT,
  servers: ['en154','en136', 'id4', 'en60', 'en61', 'en68']
};
