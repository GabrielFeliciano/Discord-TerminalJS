const Discord = require('discord.js');
const TerminalsHolder = require('./TerminalsHolder.js');
const Terminal = require('./Terminal.js');
const client = new Discord.Client();

const terminalsHolder = new TerminalsHolder();

Array.prototype.toString = function () {
    return `[${this.join(', ')}]`;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
  
const prefixs = ['js>', 'js:'];
const commands = {
    'create': function (channelsIdsUnfiltered) {
        if (channelsIdsUnfiltered.length == 0) {
            console.log('Missing arguments');
            return;
        } else if (channelsIdsUnfiltered.length > 2) {
            console.log('Too many arguments');
            return;
        }

        const channelsIds = channelsIdsUnfiltered.map(channelId => channelId.slice(2, channelId.length - 1));
        if (terminalsHolder.isRequestToNewTerminalValid(channelsIds)) {
            console.log(
                'There is a existing channel configurated in your parameters. Please, choose another channel.'
            );
            return;
        }
        
        const channelsPromises = channelsIds.map(channelId => client.channels.fetch(channelId));
        Promise.all(channelsPromises)
        .then(channels => {
            const terminal = new Terminal(channels);
            terminalsHolder.addTerminal(terminal, channelsIds);
        });
    }
}

client.on('message', message => {
    if (message.author.bot) { return; }

    const prefix = prefixs.find(prefix => message.content.startsWith(prefix));

    if (prefix) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        (commands[command] || Function)(args);
    } else {
        terminalsHolder.onMessage(message);
    }
});

client.login('NzU1MjgwNTYwMTk2NDE5NzI0.X2A_1Q.A2z0oBJOnc80eL8ZoBjySl_UpFQ');