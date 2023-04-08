/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {
    Module
} = require('../main');
const {
    setFilter, deleteFilter, getFilter,
    setGFilter, deleteGFilter, getGFilter,
    setDFilter, deleteDFilter, getDFilter
} = require('./sql/filters');
Module({
    pattern: 'filter ?(.*)',
    fromMe: true,
    desc: "Set filter (autoreply)",
    use: 'utility'
}, async (message,match)=>{
 return await message.sendReply(
`_There are three types of filter:_

_1 .cfilter - Sets filter in specific group/chat_

_2 .dfilter - Sets filter in all DMs (inbox)_

_3 .gfilter - Sets filter in all groups_

_Use .stop command to delete a filter_

_(Example: .cfilter "Hi" "Hello")_`
 )   
})
Module({
    pattern: 'stop ?(.*)',
    fromMe: true,
    desc: "Set filter (autoreply)",
    use: 'utility'
}, async (message,match)=>{
 return await message.sendReply(
`_To stop (delete) a filter, use:_

_1 .cstop - Deletes filter in specific group/chat_

_2 .dstop - Deletes filter in all DMs (inbox)_

_3 .gstop - Deletes filter in all groups_

_(Example: .cstop "hello")_`
 )   
})
    Module({
    pattern: 'cfilter ?(.*)',
    fromMe: true,
    desc: "Adds custom filter (autoreply) in specific chat",
    use: 'utility'
}, (async (message, match) => {
    match = match[1].match(/[\'\"\“](.*?)[\'\"\“]/gsm);
    if (message.reply_message.text) {
        await setFilter(message.jid, match[0].replace(/['"“]+/g, ''), message.reply_message.text, match[0][0] === "'" ? true : false);
        await message.sendReply(
            "_Set_ " + match[0].replace(/['"]+/g, '') + " _to this chat's filter ✅_"
        );
        return;
    }
    if (match === null) {
        filterer = await getFilter(message.jid);
        if (filterer === false) {
            await message.sendReply(
                "_No filters set in this chat ❌_"
            )
        } else {
            var msg = "_Your filters in this chat:_" + '\n';
            filterer.map((filter) => msg += '```' + filter.dataValues.pattern + '```\n');
            await message.sendReply(
                msg
            );
        }
    } else {
        if (match.length < 2) {
            return await message.sendReply("Wrong format" + ' ```.filter "input" "output"');
        }
        await setFilter(message.jid, match[0].replace(/['"“]+/g, ''), match[1].replace(/['"“]+/g, '').replace(/[#]+/g, '\n'), match[0][0] === "'" ? true : false);
        await message.sendReply(
        "_Successfully set " + match[0].replace(/['"]+/g, '')+" as filter in this chat_"
        );
    }
}));
Module({
    pattern: 'gfilter ?(.*)',
    fromMe: true,
    desc: "Adds global filter (autoreply) in the bot in all groups",
    use: 'utility'
}, (async (message, match) => {
    match = match[1].match(/[\'\"\“](.*?)[\'\"\“]/gsm);
    if (message.reply_message.text) {
        await setGFilter(match[0].replace(/['"“]+/g, ''), message.reply_message.text, match[0][0] === "'" ? true : false);
        await message.sendReply(
            "_Set_ " + match[0].replace(/['"]+/g, '') + " _to all groups' filter ✅_"
        );
        return;
    }
    if (match === null) {
        filterer = await getGFilter();
        if (filterer === false) {
            await message.sendReply(
                "_No filters set to all groups' ❌_"
            )
        } else {
            var msg = "_Your filters in this chat:_" + '\n';
            filterer.map((filter) => msg += '```' + filter.dataValues.pattern + '```\n');
            await message.sendReply(
                msg
            );
        }
    } else {
        if (match.length < 2) {
            return await message.sendReply("Wrong format" + ' ```.gfilter "input" "output"');
        }
        await setGFilter(match[0].replace(/['"“]+/g, ''), match[1].replace(/['"“]+/g, '').replace(/[#]+/g, '\n'), match[0][0] === "'" ? true : false);
        await message.sendReply("_Set " + match[0].replace(/['"]+/g, '')+" to all groups' filter_");
    }
}));
Module({
    pattern: 'dfilter ?(.*)',
    fromMe: true,
    desc: "Adds custom filter in all DM|PM|inbox",
    use: 'utility'
}, (async (message, match) => {
    match = match[1].match(/[\'\"\“](.*?)[\'\"\“]/gsm);
    if (message.reply_message.text) {
        await setDFilter(match[0].replace(/['"“]+/g, ''), message.reply_message.text, match[0][0] === "'" ? true : false);
        await message.sendReply("_Set_ " + match[0].replace(/['"]+/g, '') + " _to filter ✅_");
        return;
    }
    if (match === null) {
        filterer = await getDFilter();
        if (filterer === false) {
            await message.sendReply("_No filters set in DM ❌_")
        } else {
            var msg = "_Your DM filters:_" + '\n';
            filterer.map((filter) => msg += '```' + filter.dataValues.pattern + '```\n');
            await message.sendReply(msg);
        }
    } else {
        if (match.length < 2) {
            return await message.sendReply("Wrong format" + ' ```.dfilter "input" "output"');
        }
        await setDFilter(match[0].replace(/['"“]+/g, ''), match[1].replace(/['"“]+/g, '').replace(/[#]+/g, '\n'), match[0][0] === "'" ? true : false);
        await message.sendReply("Successfully set " + match[0].replace(/['"]+/g, ''));
    }
}));
Module({
    pattern: 'cstop ?(.*)',
    fromMe: true,
    use: 'utility',
    desc: "Deletes a filter from specific chat",
    dontAddCommandList: true
}, (async (message, match) => {
    match = match[1].match(/[\'\"\“](.*?)[\'\"\“]/gsm);
    if (match === null) {
        return await message.sendReply(
            "Wrong format!" + '\n*Example:* ```.cstop "hello"```'
        )
    }

    del = await deleteFilter(message.jid, match[0].replace(/['"“]+/g, ''));

    if (!del) {
        await message.sendReply(
            "There are already no filters like this in this chat ❌"
        )
    } else {
        await message.sendReply(
            "_Successfully deleted filter from this chat ✅_"
        )
    }
}));
Module({
    pattern: 'dstop ?(.*)',
    fromMe: true,
    use: 'utility',
    desc: "Deletes a DM filter",
}, (async (message, match) => {
    match = match[1].match(/[\'\"\“](.*?)[\'\"\“]/gsm);
    if (match === null) {
        return await message.sendReply(
            "Wrong format!" + '\n*Example:* ```.dstop "hello"```'
        )
    }

    del = await deleteDFilter(match[0].replace(/['"“]+/g, ''));

    if (!del) {
        await message.sendReply(
            "There are already no DM filters like this ❌"
        )
    } else {
        await message.sendReply(
            "_Successfully deleted filter from all DMs ✅_"
        )
    }
}));
Module({
    pattern: 'gstop ?(.*)',
    fromMe: true,
    use: 'utility',
    desc: "Deletes a global group filter",
}, (async (message, match) => {
    match = match[1].match(/[\'\"\“](.*?)[\'\"\“]/gsm);
    if (match === null) {
        return await message.sendReply(
            "Wrong format!" + '\n*Example:* ```.gstop "hello"```'
        )
    }

    del = await deleteGFilter(match[0].replace(/['"“]+/g, ''));

    if (!del) {
        await message.sendReply(
            "There are already no Group filters like this ❌"
        )
    } else {
        await message.sendReply(
            "_Successfully deleted from all groups' filter ✅_"
        )
    }
}));
Module({
    on: 'text',
    fromMe: false
}, (async (message, match) => {
    if (message.fromMe) return;
    var filterer = await getFilter(message.jid);
    var gfilterer = await getGFilter();
    var dfilterer = await getDFilter();
    if (!(filterer || gfilterer || dfilterer)) return;
    if (filterer){
    filterer.map(
        async (filter) => {
            pattern = new RegExp(filter.dataValues.regex ? filter.dataValues.pattern : ('\\b(' + filter.dataValues.pattern + ')\\b'), 'gm');
            if (pattern.test(message.message.toLowerCase())) {
                await message.sendReply(
                    filter.dataValues.text
                );
            }
        }
    );
    }
    if (!message.isGroup && dfilterer){
    dfilterer.map(
        async (filter) => {
            pattern = new RegExp(filter.dataValues.regex ? filter.dataValues.pattern : ('\\b(' + filter.dataValues.pattern + ')\\b'), 'gm');
            if (pattern.test(message.message.toLowerCase())) {
                return await message.sendReply(
                    filter.dataValues.text
                );
            }
        }
    ) } 
    if (message.isGroup && gfilterer) {
    gfilterer.map(
        async (filter) => {
            pattern = new RegExp(filter.dataValues.regex ? filter.dataValues.pattern : ('\\b(' + filter.dataValues.pattern + ')\\b'), 'gm');
            if (pattern.test(message.message.toLowerCase())) {
                return await message.sendReply(
                    filter.dataValues.text
                );
            }
        }
    );
    }
}));
Module({
    on: 'button',
    fromMe: false
}, (async (message, match) => {
    if (message.fromMe) return;
    if (!message.button) return;
    var filterer = await getFilter(message.jid);
    var Text = '';
    var ragAnork=Raganork;function raganork(){var RagAnork=['ssa','sRe','ect','tem','spo','has','339QyxEgc','lay','sag','675535dzKmCK','nse','onR','yMe','pla','317272ViUojx','146438iTLuSs','sel','126CmMyzj','280oMeIah','teB','427mbLyJC','dat','ton','but','per','Pro','49670lRUrzk','Tex','edD','Mes','epl','isp','27294wniYJs','878404qOfBdd','Own','mes'];raganork=function(){return RagAnork;};return raganork();}(function(rAganork,RAganork){var RAGanork=Raganork,raGanork=rAganork();while(!![]){try{var RaGanork=parseInt(RAGanork(0xe8))/0x1+parseInt(RAGanork(0xeb))/0x2*(parseInt(RAGanork(0xdf))/0x3)+-parseInt(RAGanork(0xfa))/0x4+-parseInt(RAGanork(0xe2))/0x5+parseInt(RAGanork(0xf9))/0x6*(parseInt(RAGanork(0xed))/0x7)+parseInt(RAGanork(0xe7))/0x8+parseInt(RAGanork(0xea))/0x9*(parseInt(RAGanork(0xf3))/0xa);if(RaGanork===RAganork)break;else raGanork['push'](raGanork['shift']());}catch(rAGanork){raGanork['push'](raGanork['shift']());}}}(raganork,0x2f6bc));if(message[ragAnork(0xee)+'a'][ragAnork(0xfc)+ragAnork(0xe1)+'e']['has'+ragAnork(0xfb)+ragAnork(0xf2)+'per'+'ty'](ragAnork(0xf0)+ragAnork(0xef)+ragAnork(0xfe)+'spo'+ragAnork(0xe3)+ragAnork(0xf6)+ragAnork(0xe1)+'e'))Text=message[ragAnork(0xee)+'a']['mes'+'sag'+'e'][ragAnork(0xf0)+ragAnork(0xef)+ragAnork(0xfe)+ragAnork(0xdd)+ragAnork(0xe3)+ragAnork(0xf6)+'sag'+'e'][ragAnork(0xe9)+ragAnork(0xdb)+ragAnork(0xf5)+'isp'+ragAnork(0xe0)+ragAnork(0xf4)+'t'];function Raganork(rAganork,RAganork){var raGanork=raganork();return Raganork=function(RaGanork,rAGanork){RaGanork=RaGanork-0xdb;var RAGanork=raGanork[RaGanork];return RAGanork;},Raganork(rAganork,RAganork);}if(message[ragAnork(0xee)+'a'][ragAnork(0xfc)+ragAnork(0xe1)+'e'][ragAnork(0xde)+'Own'+'Pro'+ragAnork(0xf1)+'ty']('tem'+ragAnork(0xe6)+ragAnork(0xec)+'utt'+ragAnork(0xe4)+ragAnork(0xf7)+ragAnork(0xe5)+ragAnork(0xfd)+'ge'))Text=message['dat'+'a'][ragAnork(0xfc)+'sag'+'e'][ragAnork(0xdc)+'pla'+ragAnork(0xec)+'utt'+'onR'+ragAnork(0xf7)+ragAnork(0xe5)+'ssa'+'ge']['sel'+ragAnork(0xdb)+'edD'+ragAnork(0xf8)+ragAnork(0xe0)+ragAnork(0xf4)+'t'];
    if (!filterer) return;
    filterer.map(
        async (filter) => {
            pattern = new RegExp(filter.dataValues.regex ? filter.dataValues.pattern : ('\\b(' + filter.dataValues.pattern + ')\\b'), 'gm');
            if (pattern.test(Text)) {
                await message.sendReply(
                    filter.dataValues.text
                );
            }
        }
    );
}));
