const Environment = require('./Environment');

class Terminal {
    constructor (channels) {
        this.index = 1;
        this.indexGotUpdate = false;

        this.environment = new Environment();

        this.channels = channels;
        const [terminalChannelID, memoryViewChannelID] = channels;

        this.terminalChannel = terminalChannelID;
        this.memoryViewChannel = memoryViewChannelID;
    }

    processUserInput (message) {
        this.indexGotUpdate = false;
        console.log(`Got message: ${message.content}`);

        const messageContentFiltered = this.filterMessage(message);

        this.showInput(messageContentFiltered, message);
        message.delete();

        this.execute(messageContentFiltered);
        this.showMemoryState();

        this.updateIndex();
    }

    execute (messageContentFiltered) {
        try {
            const result = this.environment.run(messageContentFiltered);
            this.showOutput(result);
        } catch (exception) {
            this.showException(exception);
        }
    }

    sendMessage (channel, message, markdown = 'javascript') {
        const threeDashes = '```'
        const markdownWrapper = (msg) => `${threeDashes}${markdown || ''}\n${msg}\n${threeDashes}`;
        channel.send(markdownWrapper(message))
        .catch(console.error);
    }

    showInput (messageInput, message) {
        const msg = `[By ${message.author.username}] In [${this.index}]:\n\n${messageInput}`;
        console.log(msg);
        this.sendMessage(this.terminalChannel, msg);
    }

    showOutput (result) {
        if (result !== undefined) {
            const msg = `Out [${this.index}]:\n\n${result}`;
            console.log(msg);
            this.sendMessage(this.terminalChannel, msg);
        }
    }

    showException (exception) {
        const msg = `> Raised Exception [${this.index}]: ${String(exception).replace(':', ' -', 1)}`;
        console.log(msg);
        this.sendMessage(this.terminalChannel, msg, 'AsciiDoc');
    }

    showMemoryState () {
        const variables = this.environment.getGlobalVariables() 
        const variablesShown = Object.keys(variables).map((variablesName, index) => {
            return `${variablesName} = ${variables[variablesName]}; (${
                Array.isArray(variables[variablesName]) ? 'Array' : typeof variables[variablesName]
            })${variables.length == index ? '' : '\n'}`;
        })
        const msg = `[Memory view]\n\n${variablesShown.join('')}`;

        if (this.memoryViewChannel) {
            this.sendMessage(this.memoryViewChannel, msg, 'AsciiDoc');
        }
    }

    filterMessage (message) {
        return message.content
    }

    updateIndex () {
        return this.index += !this.indexGotUpdate ? (this.indexGotUpdate = true) : 0;
    }
}

module.exports = Terminal;