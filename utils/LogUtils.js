const { MessageFlags } = require("discord.js");
const { LogResponseComponent } = require("../components/responses/LogResponseComponent");
const Setups = require('../database/models/Setups');

class LogUtils {
    static async sendLog(placeholder, guild, color, variable) {
        try {
            const setup = await Setups.findOne({ where: { guildId: guild.id } });
            if (!setup) return;

            const logChannel = guild.channels.cache.get(setup.logChannelId);
            if (!logChannel || !logChannel.isTextBased()) {
                return console.log(`Couldn't get logChannel, please set a logChannel.`);
            } 

            const container = LogResponseComponent.create(
                placeholder, 
                setup.defaultLang || 'en-US', 
                color, 
                variable);

            await logChannel.send({ 
                components: [container], 
                flags: MessageFlags.IsComponentsV2 
            });
        } catch (err) {
            console.error(`[LogUtils] Failed to send log.`, err);
        }
    }
}

module.exports.LogUtils = LogUtils;
