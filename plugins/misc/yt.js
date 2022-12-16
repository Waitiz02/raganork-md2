let fetch = require('node-fetch')
const axios = require("axios")
let { JSDOM } = require('jsdom')

async function dlSong(vid){
  const { Innertube, UniversalCache } = require('youtubei.js');
  const { readFileSync, existsSync, mkdirSync, createWriteStream } = require('fs');
  const {streamToIterable} = require('youtubei.js/dist/src/utils/Utils');
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
  return true;
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
  downloadYT,
  servers: ['en154','en136', 'id4', 'en60', 'en61', 'en68']
};
