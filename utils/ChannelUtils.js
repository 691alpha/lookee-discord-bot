const { ChannelType } = require("discord.js");

module.exports = class ChannelUtils {
    static createChannel(interaction, category, name) {
        const parent = interaction.guild.channels.cache.find(x => x.name == `${category}`);
        if(!partent) interaction.reply('Category does not exist.');
        if(parent) {
            parent.children.create({
                type: ChannelType.GuildText,
                name: `${name}`
            });
            interaction.reply(`Created Channel: ${name}.`);
        }
    }
}