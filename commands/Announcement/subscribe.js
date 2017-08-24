const { Command } = require('../../index');
const announcement = require('../../utils/announcement');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            guildOnly: true,

            description: 'Subscribe to this servers\' announcements.',
            cooldown: 15
        });
    }

    async run(msg) {
        const role = announcement(msg);
        await msg.member.addRole(role);
        return msg.send(msg.language.get('COMMAND_SUBSCRIBE_SUCCESS', role.name));
    }

};
