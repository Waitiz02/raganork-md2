/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
async function sendButton(buttons,text,footer,message){
    const buttonMessage = {text,footer,buttons,headerType: 1}
    return await message.client.sendMessage(message.jid, buttonMessage)
    };
    const isVPS = !(__dirname.startsWith("/rgnk") && __dirname.startsWith("/skl"));
    const isHeroku = __dirname.startsWith("/skl");
    const {
        Module
    } = require('../main');
    const {
        update
    } = require('./misc/koyeb');
    const pm2 = require('pm2')
    const {
        isAdmin,
        delAntilink,
        getAntilink,
        setAntilink
    } = require('./misc/misc');
    const {
        skbuffer 
    } = require('raganork-bot');
    const { 
        chatBot
    } = require('./misc/misc');
    const Config = require('../config');
    const config = require('../config');
    const Heroku = require('heroku-client');
    const fs = require('fs');
    const got = require('got');
    const {
        getString
    } = require('./misc/lang');
    const Lang = getString('heroku');
    const heroku = new Heroku({
        token: Config.HEROKU.API_KEY
    });
    var handler = Config.HANDLERS !== 'false'?Config.HANDLERS.split("")[0]:""
    function secondsToDhms(seconds) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600*24));
        var h = Math.floor(seconds % (3600*24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        
        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
        }
    let baseURI = '/apps/' + Config.HEROKU.APP_NAME;
    Module({
        pattern: 'restart$',
        fromMe: true,
        dontAddCommandList: true,
        use: 'owner'
    }, (async (message, match) => {
        if (!isHeroku) return await message.sendReply("_This is a heroku command, but this bot is not running on heroku!_");
        await message.sendReply(Lang.RESTART_MSG)
        await heroku.delete(baseURI + '/dynos').catch(async (error) => {
            await message.send(error.message)
        });
    }));
    Module({
        pattern: 'shutdown$',
        fromMe: true,
        dontAddCommandList: true,
        use: 'owner'
    }, (async (message, match) => {
        if (isVPS){
            return await pm2.stop("Raganork");
        } else if (isHeroku){
            await heroku.get(baseURI + '/formation').then(async (formation) => {
            forID = formation[0].id;
            await message.sendReply(Lang.SHUTDOWN_MSG)
            await heroku.patch(baseURI + '/formation/' + forID, {
                body: {
                    quantity: 0
                }
            });
        }).catch(async (err) => {
            await message.send(error.message)
        });
    } else return await message.sendReply("_This is a heroku command, but this bot is not running on heroku!_");
    }));
    Module({
        pattern: 'dyno$',
        fromMe: true,
        dontAddCommandList: true,
        use: 'owner'
    }, (async (message, match) => {
        if (!isHeroku) return await message.sendReply("_This is a heroku command, but this bot is not running on heroku!_");
        heroku.get('/account').then(async (account) => {
            url = "https://api.heroku.com/accounts/" + account.id + "/actions/get-quota"
            headers = {
                "User-Agent": "Chrome/80.0.3987.149 Mobile Safari/537.36",
                "Authorization": "Bearer " + Config.HEROKU.API_KEY,
                "Accept": "application/vnd.heroku+json; version=3.account-quotas",
            }
            await got(url, {
                headers: headers
            }).then(async (res) => {
                const resp = JSON.parse(res.body);
                total_quota = Math.floor(resp.account_quota);
                quota_used = Math.floor(resp.quota_used);
                percentage = Math.round((quota_used / total_quota) * 100);
                remaining = total_quota - quota_used;
                await message.sendReply(
                    "_Total: *{}*_\n".format(secondsToDhms(total_quota)) +
                    "_Used: *{}*_\n".format(secondsToDhms(quota_used)) +
                    "_Percent: *{}*_\n".format(percentage) +
                    "_Remaining: *{}*_\n".format(secondsToDhms(remaining)))
    
            }).catch(async (err) => {
                await message.send(error.message)
            });
        });
    }));
    Module({
        pattern: 'setvar ?(.*)',
        fromMe: true,
        desc: Lang.SETVAR_DESC,
        use: 'owner'
    }, (async (message, match) => {
        match=match[1]
        var m = message;
        if (!match) return await m.sendReply("_Need params!_\n_Eg: .setvar MODE:public_")
        let key = match.split(":")[0]
        let value =match.replace(key+":","").replace(/\n/g, '\\n')
        if (!isHeroku) return await message.sendReply("_Command currently unavailable for heroku_");
        config[key] = value
        if (isVPS){
        try { 
        var envFile = fs.readFileSync(`./config.env`).toString('utf-8')
        let matches = envFile.split('\n').filter(e=>e.startsWith(key))
        if (matches.length==1){
            let newEnv = envFile.replace(matches[0].split('=')[1],config[key])
            await fs.writeFileSync(`./config.env`,newEnv)
        } else {
            let newEnv = envFile+'\n'+key+'='+config[key]
            await fs.writeFileSync(`./config.env`,newEnv)
        }
        await m.sendReply(`_Successfully set ${key} to ${config[key]}, rebooting._`)
        if (key == "SESSION"){
        await require('fs-extra').removeSync('./baileys_auth_info'); 
        }
        process.exit(0)    
    } catch(e){
            return await m.sendReply("_Are you a VPS user? Check out wiki for more._\n"+e.message);
        }
        } else {
            let set_res = await update(key,value)
            if (set_res) return await m.sendReply(`_Successfully set ${key} to ${value}, redeploying._`)
            else throw "Error!"
        }   
    }));
    
    Module({
        pattern: 'delvar ?(.*)',
        fromMe: true,
        desc: Lang.DELVAR_DESC,
        use: 'owner'
    }, (async (message, match) => {
        if (!isHeroku) return await message.sendReply("_This is a heroku command, but this bot is not running on heroku!_");
        if (match[1] === '') return await message.sendReply(Lang.NOT_FOUND)
        await heroku.get(baseURI + '/config-vars').then(async (vars) => {
            key = match[1].trim();
            for (vr in vars) {
                if (key == vr) {
                    await heroku.patch(baseURI + '/config-vars', {
                        body: {
                            [key]: null
                        }
                    });
                    return await message.sendReply(Lang.DEL_SUCCESS.format(key))
                }
            }
            await await message.sendReply(Lang.NOT_FOUND)
        }).catch(async (error) => {
            await message.sendReply(error.message)
        });
    
    }));
    Module({
        pattern: 'getvar ?(.*)',
        fromMe: true,
        desc: Lang.GETVAR_DESC,
        use: 'owner'
    }, (async (message, match) => {
        if (match[1] === '') return await message.sendReply(Lang.NOT_FOUND)
        return await message.sendReply(config[match[1].trim()]?.toString() || "Not found")
   }));
    Module({
            pattern: "allvar",
            fromMe: true,
            desc: Lang.ALLVAR_DESC,
            use: 'owner'
        },
        async (message, match) => {
            if (isVPS) {
                return await message.sendReply(fs.readFileSync(`./config.env`).toString('utf-8'));
            }
            if (!isHeroku) return await message.sendReply("_This is a heroku command, but this bot is not running on heroku!_");
            let msg = Lang.ALL_VARS + "\n\n\n```"
            await heroku
                .get(baseURI + "/config-vars")
                .then(async (keys) => {
                    for (let key in keys) {
                        msg += `${key} : ${keys[key]}\n\n`
                    }
                    return await await message.sendReply(msg += '```')
                })
                .catch(async (error) => {
                    await message.send(error.message)
                })
        }
    );
    Module({
        pattern: 'chatbot ?(.*)',
        fromMe: true,
        desc: "Activates chatbot",
        use: 'config'
    }, (async (message, match) => {
        if (match[1]!=="button_on" && match[1]!=="button_off"){
            var buttons = [
                {buttonId: handler+'setvar CHATBOT:on', buttonText: {displayText: 'ON'}, type: 1},
                {buttonId: handler+'setvar CHATBOT:off', buttonText: {displayText: 'OFF'}, type: 1}
            ]
        }
        return await sendButton(buttons,"*ChatBot control panel*","Chatbot is currently turned "+Config.CHATBOT+" now",message)
    }));
    Module({
        pattern: 'settings ?(.*)',
        fromMe: true,
        desc: "Bot settings. Enable extra options related to WhatsApp visibility.",
        use: 'owner'
    }, (async (message, match) => {
        if (match[1].includes(";")){
            let key_ = match[1].split(";")
            var buttons = [
                {buttonId: handler+`setvar ${key_[0]}:true`, buttonText: {displayText: 'ON'}, type: 1},
                {buttonId: handler+`setvar ${key_[0]}:false`, buttonText: {displayText: 'OFF'}, type: 1}
            ]
            return await sendButton(buttons,`_${key_[1]}_`,`_Current status: ${config[key_[0]]?'enabled':'disabled'}_`,message)
    
        }
            const sections = [
                {
                title: "Configure these:",
                rows: [
                    {title: "Auto read all messages", rowId: handler+"settings READ_MESSAGES;Auto read all messages"},
                    {title: "Auto read command messages", rowId: handler+"settings READ_COMMAND;Auto read command messages"},
                    {title: "Auto read status updates", rowId: handler+"settings AUTO_READ_STATUS;Auto read status updates"},
                    {title: "Auto reject calls", rowId: handler+"settings REJECT_CALLS;Auto reject calls"},
                    {title: "Always online", rowId: handler+"settings ALWAYS_ONLINE;Always Online"},
                    {title: "PM Auto blocker", rowId: handler+"settings PMB_VAR;PM auto blocker"},
                    {title: "Disable bot in PM", rowId: handler+"settings DIS_PM;Disable public bot use in PM"}
                ]
                }
            ]
            
            const listMessage = {
              text: " ",
              footer: "_Configure your settings_",
              title: "_Settings_",
              buttonText: "view",
              sections
            }
            
         return await message.client.sendMessage(message.jid, listMessage)
        }));
    Module({
        pattern: 'mode ?(.*)',
        fromMe: true,
        desc: "Change bot mode to public & private",
        use: 'config'
    }, (async (message, match) => {
        const buttons = [
            {buttonId: handler+'setvar MODE:public', buttonText: {displayText: 'PUBLIC'}, type: 1},
            {buttonId: handler+'setvar MODE:private', buttonText: {displayText: 'PRIVATE'}, type: 1}
        ]
        return await sendButton(buttons,"*Mode switcher*","Current mode: "+Config.MODE,message)
    }));
    Module({
        pattern: 'antispam ?(.*)',
        fromMe: true,
        desc: "Detects spam messages and kicks user.",
        use: 'group'
    }, (async (message, match) => {
        var admin = await isAdmin(message)
        if (!admin) return await message.sendReply("_I'm not admin_");
        var Jids = Config.ANTI_SPAM?.split(',') || []
        var msg = Config.ANTI_SPAM;
        var toggle = "on"
        var off_msg = Jids?.filter(e=>e!==message.jid) || 'false'
        if (!Jids.includes(message.jid)){
            Jids.push(message.jid)
            msg = Jids.join(",")
            toggle = "off"
        }
        const buttons = [
            {buttonId: handler+'setvar ANTI_SPAM:'+msg, buttonText: {displayText: 'ON'}, type: 1},
            {buttonId: handler+'setvar ANTI_SPAM:'+off_msg, buttonText: {displayText: 'OFF'}, type: 1}
        ]
        return await sendButton(buttons,"*Antispam control panel*","Antispam is currently "+toggle,message)
    }));
    Module({
        pattern: 'antibot ?(.*)',
        fromMe: true,
        desc: "Detects other bot's messages and kicks.",
        use: 'group'
    }, (async (message, match) => {
        var admin = await isAdmin(message)
        if (!admin) return await message.sendReply("_I'm not admin_");
        var Jids = Config.ANTI_BOT?.split(',') || []
        var msg = Config.ANTI_BOT;
        var toggle = "on"
        var off_msg = Jids?.filter(e=>e!==message.jid) || 'false'
        if (!Jids.includes(message.jid)){
            Jids.push(message.jid)
            msg = Jids.join(",")
            toggle = "off"
        }
        const buttons = [
            {buttonId: handler+'setvar ANTI_BOT:'+msg, buttonText: {displayText: 'ON'}, type: 1},
            {buttonId: handler+'setvar ANTI_BOT:'+off_msg, buttonText: {displayText: 'OFF'}, type: 1}
        ]
        return await sendButton(buttons,"_Antibot mode_","Current status: "+toggle,message)
    }));
    Module({
        pattern: 'antilink ?(.*)',
        fromMe: true,
        desc: "Activates antilink",
        use: 'config'
    }, (async (message, match) => {
        var db = await getAntilink();
        const jids = []
        db.map(data => {
            jids.push(data.jid)
        });
        if (match[1] === "button_on"){
            if (!(await isAdmin(message))) return await message.sendReply("_I'm not an admin!_")
            await setAntilink(message.jid) 
        }
        if (match[1] === "button_off"){
            if (!(await isAdmin(message))) return await message.sendReply("_I'm not an admin!_")
            await delAntilink(message.jid)  
        }
        if (match[1]!=="button_on" && match[1]!=="button_off"){
        const buttons = [
            {buttonId: handler+'antilink button_on', buttonText: {displayText: 'ON'}, type: 1},
            {buttonId: handler+'antilink button_off', buttonText: {displayText: 'OFF'}, type: 1}
        ]
        var status = jids.includes(message.jid) ? 'on' : 'off';
        var {subject} = await message.client.groupMetadata(message.jid)
        return await sendButton(buttons,`_Antilink menu of ${subject}_`,"_Antilink is currently turned "+status+"_",message)
        }
        await message.sendReply(match[1] === "button_on" ? "_Antilink activated!_" : "_Antilink deactivated!_");
    }));
    Module({
        on: 'text',
        fromMe: false
    }, (async (message, match) => {
        if (Config.CHATBOT === 'on') {
            await chatBot(message, Config.BOT_NAME)
        }
        if (/\bhttps?:\/\/\S+/gi.test(message.message)){
        var db = await getAntilink();
        const jids = []
        db.map(data => {
            jids.push(data.jid)
        });
        if (jids.includes(message.jid)) {
        var allowed = process.env.ALLOWED_LINKS || "gist,instagram,youtu";
        var checker = [];
        allowed.split(",").map(e=> checker.push(message.message.includes(e)))
        if (!checker.includes(true)){
        if (!(await isAdmin(message,message.sender))) {
        var usr = message.sender.includes(":") ? message.sender.split(":")[0]+"@s.whatsapp.net" : message.sender
        await message.client.sendMessage(message.jid, { delete: message.data.key })
        await message.sendReply("_Link not allowed!_");
        await message.client.groupParticipantsUpdate(message.jid, [usr], "remove")
        }
        }
        }
    }
    }));
    
