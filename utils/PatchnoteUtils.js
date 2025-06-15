const { MessageFlags } = require("discord.js");
const { PatchNoteComponent } = require("../components/PatchNoteComponent");
const PatchNoteNodes = require("../database/models/PatchNoteNodes");
const PatchNotePreviews = require("../database/models/PatchNotesPreviews");
const Setups = require('../database/models/Setups');
const EPatchNoteStatus = require("../enums/EPatchNoteStatus");

class PatchnoteUtils {
    
    /**
     * Updates all previously sent patchnotes to show all nodes with a current status of 
     * 'planned' or 'done' whilst keeping the button component
     * @param {*} interaction 
     */
    static async updateAllPatchNotePreviews(guild, client, lang) {

        const { PatchNoteButtonComponentOne } = require('../components/PatchNoteButtonComponentOne');
        const { PatchNoteButtonComponentTwo } = require('../components/PatchNoteButtonComponentTwo');

        const guildId = guild.id;
        const previews = await PatchNotePreviews.findAll({ where: { guildId } });

        const nodes = await PatchNoteNodes.findAll({
            where: {
                guildId,
                status: [EPatchNoteStatus.DONE || EPatchNoteStatus.PLANNED]
            }
        });

        for (const preview of previews) {
            try {
                const channel = await client.channels.fetch(preview.channelId);
                const message = await channel.messages.fetch(preview.messageId);

                const outputContainer = await PatchNoteComponent.create(
                    nodes, 
                    lang, 
                    'edit', 
                    guild
                );
                let outputButtonsOne = await PatchNoteButtonComponentOne.create(lang);
                let outputButtonsTwo = await PatchNoteButtonComponentTwo.create(lang);

                await message.edit({ 
                    components: [
                        outputContainer, 
                        outputButtonsOne, 
                        outputButtonsTwo
                    ],
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
     * @returns the nodes or null if none found
     */
    static async findAllNodes(guildId, status, published) {
        const nodes = await PatchNoteNodes.findAll({
            where: {
                guildId: guildId,
                status: status,
                published: published
            }
        });

        if (!nodes || nodes.length === 0) return null;

        return nodes;
    }

    static async checkPatchnoteRole(guild) {
        const setup = await Setups.findOne({ where: { guildId: guild.id } });
        if(!setup) console.log ('No setup found, create setup');

        let role = setup.patchnoteRoleId
            ? guild.roles.cache.get(setup.patchnoteRoleId)
            : null;

        if (!role) {
            role = await guild.roles.create({
                name: 'Patchnote Ping',
                mentionable: true,
                reason: 'Auto-created for patchnote pinging',
            });

            if (setup) {
                await Setups.update(
                    { patchnoteRoleId: role.id },
                    { where: { guildId: guild.id } }
                );
            } else {
                await Setups.create({
                    id: await db.getNextId('setups'),
                    guildId: guildId,
                    assignedTicketsCategoryId: null,
                    unassignedTicketsCategoryId: null,
                    closedTicketsCategoryId: null,
                    announcementChannelId: null,
                    logChannelId: null,
                    defaultLang: 'en-US',
                    patchnoteRoleId: role.id
                });
            }
        }

        return role;
    }
}

module.exports.PatchnoteUtils = PatchnoteUtils;
