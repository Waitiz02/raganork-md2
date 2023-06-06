const {Module} = require('../main');
const {MODE,RBG_KEY} = require('../config');
const w = MODE == 'public' ? false : true
const fs = require('fs');
const got = require('got');
const FormData = require('form-data');
const stream = require('stream');
const {promisify} = require('util');
const pipeline = promisify(stream.pipeline);
const {removeBgv2} = require('./misc/editors');
Module({pattern: 'removebg ?(.*)', fromMe: w,use: 'edit', desc: "Removes image background"}, (async (message, match) => {    
if (!message.reply_message?.image) return await message.send("_Reply to a photo_");
if (!RBG_KEY) {
    await message.sendReply(await removeBgv2(await message.reply_message.download('buffer')),'image')
    return await message.send('_Use doc command to convert this image to a document_')
}
    try {
        var location = await message.reply_message.download();
        var form = new FormData();
        form.append('image_file', fs.createReadStream(location));
        form.append('size', 'auto');
        var rbg = await got.stream.post('https://api.remove.bg/v1.0/removebg', {
            body: form,
            headers: {'X-Api-Key': RBG_KEY}
        }); 
        await pipeline(
		    rbg,
		    fs.createWriteStream('rbg.png')
        );
        await message.sendReply(fs.readFileSync('rbg.png'),'image');    
    } catch {
        await message.sendReply(await removeBgv2(await message.reply_message.download('buffer')),'image')
        return await message.send('_Use doc command to convert this image to a document_')
    }
    }));
