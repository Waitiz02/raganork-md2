let fetch = require('node-fetch')
const axios = require("axios")
let { JSDOM } = require('jsdom')
const { Innertube, UniversalCache } = require('youtubei.js');
const { readFileSync, existsSync, mkdirSync, createWriteStream } = require('fs');
const {streamToIterable} = require('youtubei.js/dist/src/utils/Utils');
var path = require('path');
function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
async function getVideo(vid,res_='360p'){
  const yt = await Innertube.create({ cache: new UniversalCache() });
  const time1 = new Date().getTime()
  const stream = await yt.download(vid, {
    type: 'video', 
    quality: res_,
    format: 'mp4'
  });
  const file = createWriteStream(`./temp/ytv.mp4`);
  for await (const chunk of streamToIterable(stream)) {
    file.write(chunk);
  }
  return `./temp/ytv.mp4`
};
async function ytv(vid,res_='360p'){
  const video = await getVideo(vid,res_);
  const audio = await dlSong(vid)
  return await require('./misc').avMix(video,audio)
}
async function getResolutions(vid){
  const yt = await Innertube.create({ cache: new UniversalCache() });
  const result_ =  (await yt.getInfo(vid)).streaming_data.adaptive_formats.filter(e=>e.has_video && e.mime_type.includes('mp4'))
  const result = []
  for (x of result_){
      result.push({size:bytesToSize(x.content_length),quality:x.quality_label.split('p')[0]+'p',fps60:x.quality_label.endsWith('p60')})
  }
  return result;
}
async function dlSong(vid){
  const yt = await Innertube.create({ cache: new UniversalCache() });
  const stream = await yt.download(vid, {
    type: 'audio', 
    quality: 'best',
    format: 'mp4'
  });
  const file = createWriteStream(`./temp/song.m4a`);
  for await (const chunk of streamToIterable(stream)) {
    file.write(chunk);
  }
  return `./temp/song.m4a`;
}
async function ytTitle(vid){
  const yt = await Innertube.create({ cache: new UniversalCache() });
  const video = await yt.getBasicInfo(vid);
  return video.basic_info.title
}
async function downloadYT(vid,type = 'video',quality = '360p'){
 try { 
var result = (await axios(`https://y2mate.souravkl11.xyz/get?vid=${vid}&type=${type}&resolution=${quality}`)).data
if (!result.url) result = (await axios(`https://y2mate.souravkl11.xyz/get?vid=${vid}&type=${type}&resolution=${quality}`)).data
} catch {
var result = (await axios(`https://y2mate.souravkl11.xyz/get?vid=${vid}&type=${type}&resolution=${quality}`)).data
} 
return result 
}
module.exports = {
  dlSong ,
  ytTitle,
  ytv, getResolutions,
  downloadYT,
  servers: ['en154','en136', 'id4', 'en60', 'en61', 'en68']
};
