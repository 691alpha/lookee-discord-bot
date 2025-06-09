const { MessageFlags } = require("discord.js");
const { PatchNoteComponent } = require("../components/PatchNoteComponent");
const PatchNoteNodes = require("../database/models/PatchNoteNodes");
const PatchNotePreviews = require("../database/models/PatchNotesPreviews");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { EmptyResultError } = require("sequelize");

class PatchnoteUtils {
    
    /**
     * Updates all previously sent patchnotes to show all nodes with a current status of 
     * 'planned' or 'done' whilst keeping the button component
     * @param {*} interaction 
     */
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

                const container = await PatchNoteComponent.create(nodes, interaction);
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


    /**
     * Gets all nodes from the database with a status 'planned' or 'done'
     * @param {string} guildId 
     * @param {string} lang 
     * @param {string} action 
     * @returns 
     */
    static async findAllNodes(guildId, lang, action) {
        const nodes = await PatchNoteNodes.findAll({
            where: {
                guildId: guildId,
                status: ['done', 'planned']
            }
        });

        if (!nodes || nodes.length === 0) {
            throw EmptyResultError(LocalisationManager.getString(
                'patchnote_no_nodes', lang, {"action": action}
            ));
            
            // TODO: remove this
            // interaction.reply({
            //     content: LocalisationManager.getString('patchnote_no_nodes', lang, {"action": action})  
            // });
        }

        return nodes;
    }
}

module.exports.PatchnoteUtils = PatchnoteUtils;
