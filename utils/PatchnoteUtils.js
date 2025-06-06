const { MessageFlags } = require("discord.js");
const { PatchNoteComponent } = require("../components/PatchNoteComponent");
const PatchNoteNodes = require("../database/models/PatchNoteNodes");
const PatchNotePreviews = require("../database/models/PatchNotesPreviews");

class PatchnoteUtils {
    
    static async updateAllPatchNotePreviews(interaction) {

        const { PatchNoteButtonComponent } = require("../components/PatchNoteButtonComponent");

        const guildId = interaction.guild.id;
        const client = interaction.client;
        const previews = await PatchNotePreviews.findAll({ where: { guildId } });
        const nodes = await PatchNoteNodes.findAll({
            where: {
                guildId,
                status: ['done', 'planned']
            }
        });

        for (const preview of previews) {
            try {
                const channel = await client.channels.fetch(preview.channelId);
                const message = await channel.messages.fetch(preview.messageId);

                const container = await PatchNoteComponent.buildFromNodes(nodes, interaction);
                let outputButtons = await PatchNoteButtonComponent.create(interaction);
                await message.edit({ 
                    components: [container,outputButtons],
                    flags: MessageFlags.IsComponentsV2
                });
            } catch (e) {
                console.log(e);
            }
        }
    }
}

module.exports.PatchnoteUtils = PatchnoteUtils;
