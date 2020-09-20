class TerminalsHolder {
    constructor (terminals = []) {
        this.terminals = terminals;
        // WARNING: TO FIX DOWN
        this.channelsIDs_InUse = [];
    }

    isRequestToNewTerminalValid (channelsIds) {
        return channelsIds.some(channelID => this.channelsIDs_InUse.includes(channelID));
    }

    addTerminal (terminal, channelsIDS) { 
        this.terminals.push(terminal); 
        this.channelsIDs_InUse.push(...channelsIDS);

        console.log('Adding new terminal to list!');
        console.log(`Channels in use: ${this.channelsIDs_InUse.join(', ')}`);
    }

    onMessage (message) {
        const messageChannelID = message.channel.id
        const correspondingTerminal = this.terminals.find(
            terminal => terminal.terminalChannel.id === messageChannelID
        );

        if (correspondingTerminal) {
            correspondingTerminal.processUserInput(message);
        }
    }
}

module.exports = TerminalsHolder;