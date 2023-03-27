/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const simpleGit = require('simple-git');
const git = simpleGit();
const {Module} = require('../main');
const {update} = require('./misc/koyeb');
const {MessageType} = require('@adiwajshing/baileys');
const Config = require('../config');
const exec = require('child_process').exec;
const Heroku = require('heroku-client');
const { PassThrough } = require('stream');
const heroku = new Heroku({ token: Config.HEROKU.API_KEY })
const { skbuffer } = require('raganork-bot');
var handler = Config.HANDLERS !== 'false'?Config.HANDLERS.split("")[0]:"";
let isHeroku = Config.HEROKU.API_KEY && Config.HEROKU.APP_NAME
Module({
    pattern: 'update ?(.*)',
    fromMe: true,
    desc: "Updates bot",
    use: 'owner'
}, (async (message, match) => {
    if (match[1] == "start") return;
    await git.fetch();
    var commits = await git.log(['main' + '..origin/' + 'main']);
    var mss = '';
    if (commits.total === 0) {
        mss = "*Bot up to date!*"
        return await message.sendReply(mss);
    } else {
        var changelog = "_Pending updates:_\n\n";
        for (var i in commits.all){
        changelog += `${(parseInt(i)+1)}• *${commits.all[i].message}*\n`
    }
}
        changelog+=`\n_Use ".update start" to start the update_`
          const Message = {
              text: changelog
            }
    return await message.client.sendMessage(message.jid,Message)   
}));
Module({pattern: 'update start',use: 'owner', fromMe: true,dontAddCommandList: true, desc: "Updates bot"}, (async (message, match) => {
    await git.fetch();
    var commits = await git.log(['main' + '..origin/' + 'main']);
    if (commits.total === 0) {
        return await message.client.sendMessage(message.jid, { text:"_Bot up to date_"})

        } 
    if (!__dirname.startsWith("/rgnk") && !isHeroku){
        await require("simple-git")().reset("hard",["HEAD"])
        await require("simple-git")().pull()
        await message.sendReply("_Successfully updated. Please manually update npm modules if applicable!_")
        process.exit(0);    
        }
        else if (isHeroku) {
            await message.client.sendMessage(message.jid, { text:"_Started update.._"})

            try {
                var app = await heroku.get('/apps/' + Config.HEROKU.APP_NAME)
            } catch {
                await message.client.sendMessage(message.jid, { text:"Heroku information wrong!"})

                await new Promise(r => setTimeout(r, 1000));
            }
            git.fetch('upstream', 'main');
            git.reset('hard', ['FETCH_HEAD']);

            var git_url = app.git_url.replace(
                "https://", "https://api:" + Config.HEROKU.API_KEY + "@"
            )
            
            try {
                await git.addRemote('heroku', git_url);
            } catch { console.log(''); }
            await git.push('heroku', 'main');

            await message.client.sendMessage(message.jid, { text:"_Successfully updated_"})
           await message.client.sendMessage(message.jid, { text:"_Restarting_"})
            } else {
                await update("UPDATER",'default')
                await message.client.sendMessage(message.jid, { text:"_Update started!_"})
    }
    }));
Module({pattern: 'updt',use: 'owner', fromMe: true,dontAddCommandList: true, desc: "Updates bot"}, (async (message, match) => {
    await git.fetch();
    var commits = await git.log(['main' + '..origin/' + 'main']);
    if (commits.total === 0) {
        return await message.client.sendMessage(message.jid, { text:"_Bot up to date_"})

        } 
    if (!__dirname.startsWith("/rgnk") && !isHeroku){
        await require("simple-git")().reset("hard",["HEAD"])
        await require("simple-git")().pull()
        await message.sendReply("_Successfully updated. Please manually update npm modules if applicable!_")
        process.exit(0);    
        }
        else if (isHeroku) {
            await message.client.sendMessage(message.jid, { text:"_Started update.._"})

            try {
                var app = await heroku.get('/apps/' + Config.HEROKU.APP_NAME)
            } catch {
                await message.client.sendMessage(message.jid, { text:"Heroku information wrong!"})

                await new Promise(r => setTimeout(r, 1000));
            }
            git.fetch('upstream', 'main');
            git.reset('hard', ['FETCH_HEAD']);

            var git_url = app.git_url.replace(
                "https://", "https://api:" + Config.HEROKU.API_KEY + "@"
            )
            
            try {
                await git.addRemote('heroku', git_url);
            } catch { console.log(''); }
            await git.push('heroku', 'main');

            await message.client.sendMessage(message.jid, { text:"_Successfully updated_"})
           await message.client.sendMessage(message.jid, { text:"_Restarting_"})
            } else {
                await update("UPDATER",'default')
                await message.client.sendMessage(message.jid, { text:"_Update started!_"})
    }
    }));
