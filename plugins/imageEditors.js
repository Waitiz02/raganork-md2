let {Module} = require('../main');
let {MODE} = require('../config');
let {edit} = require("./misc/editors.js")
let fromMe = MODE == 'public' ? false : true;
let ffmpeg = require('fluent-ffmpeg');
let {skbuffer} = require('raganork-bot');
let fs = require('fs');
Module({pattern: 'wanted ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a wanted effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await edit(q,'wanted')
await m.sendReply({url:res},"image") }))
Module({pattern: 'mission failed ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a wanted effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await edit(q,'missionfailed')
await m.sendReply({url:res},"image") }))
Module({pattern: 'delete ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a delete file effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await edit(q,'delete')
await m.sendReply({url:res},"image") }))
Module({pattern: 'respect ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a delete file effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await edit(q,'respect')
await m.sendReply({url:res},"image") }))
Module({pattern: 'wasted ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a wasted effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await edit(q,'wasted')
await m.sendReply({url:res},"image") }))
Module({pattern: 'blur ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a blur effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
if (!text[1]) return await m.sendMessage("Need any value (1 - 100)\neg: .blur 10")
var q = await m.reply_message.download()
var res = await edit(q,'blur')
await m.sendReply({url:res},"image") }))
Module({pattern: 'draw ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a drawing effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await edit(q,'draw')
await m.sendReply({url:res},"image") }))
Module({pattern: 'sketch ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a sketch effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await edit(q,'sketch')
await m.sendReply({url:res},"image") }))
Module({pattern: 'rip ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a rip effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await edit(q,'rip')
await m.sendReply({url:res},"image") }))
Module({pattern: 'scary ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a scay effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await edit(q,'scary')
await m.sendReply({url:res},"image") }))
Module({pattern: 'mission passed ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a mission passed effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await edit(q,'missionpassed')
await m.sendReply({url:res},"image") }))
Module({pattern: 'reject ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a rejected effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await edit(q,'rejected')
await m.sendReply({url:res},"image") }))
Module({pattern: 'jail ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a jail effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await edit(q,'jail')
await m.sendReply({url:res},"image") }))
Module({pattern: 'contrast ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a contrast effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await edit(q,'contrast')
await m.sendReply({url:res},"image") }))
Module({pattern: 'ytcomment ?(.*)', fromMe, use: "template edit", desc:'Makes a youtube comment image with image,text and username'}, (async (m, text) => { 
if (!text[1]) return await m.sendMessage("Need any text")
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await edit(q,'ytcomment',text[1])
await m.sendReply({url:res},"image");}));
Module({pattern: 'burn ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a fire effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await edit(q,'burn')
await m.sendReply({url:res},"image") }))
Module({pattern: 'fire ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a fire meme effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await edit(q,'fire')
await m.sendReply({url:res},"image") }))
Module({pattern: 'trash ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a trash meme effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await edit(q,'trash')
await m.sendReply({url:res},"image") }))
Module({pattern: 'approve ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a approved effect'}, (async (m, match) => { 
var q = await m.reply_message.download()
var res = await edit(q,'approved')
await m.sendReply({url:res},"image") }))
Module({pattern: 'trigger ?(.*)', fromMe, use: "template edit", desc:'Edits photo to a wanted effect'}, (async (m, match) => { 
if (!m.reply_message.image) return await m.sendMessage("_Reply to an image!_")
var q = await m.reply_message.download()
var res = await skbuffer(await edit(q,'triggered'))
await fs.writeFileSync('st.mp4', res)
ffmpeg('st.mp4')
.outputOptions(["-y", "-vcodec libwebp", "-lossless 1", "-qscale 1", "-preset default", "-loop 0", "-an", "-vsync 0", "-s 600x600"])
.videoFilters('scale=600:600:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=600:600:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1')
.save('tri.webp')
.on('end', async () => {
await m.sendReply(fs.readFileSync('tri.webp'),"sticker");
});}));  