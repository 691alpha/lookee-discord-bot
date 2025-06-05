const { ButtonBuilder, ButtonStyle, MessageFlags, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const PatchNoteNodes = require("../../database/models/PatchNoteNodes");
const { PatchNoteNodeSelectMenu } = require("../../menus/PatchNoteNodeSelectMenu");

class PatchNoteDeleteNodeButton {
    static customId = "PatchNoteDeleteNodeButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(PatchNoteDeleteNodeButton.customId)
            .setLabel(LocalisationManager.getString('delete_node_patchnote_node_button', lang))
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const nodes = await PatchNoteNodes.findAll({
            where: {
                guildId: interaction.guild.id,
                status: ['done', 'planned']
            }
        });

        if (!nodes.length) {
            return interaction.editReply({
                content: 'No patch notes with status `done` or `planned` to edit.'
            });
        }

        const lang = interaction?.locale ?? 'en-US';

        const placeholder = LocalisationManager.getString('delete_node_selection', lang)

        const selectMenu = PatchNoteNodeSelectMenu.create(lang, nodes, placeholder, 'delete')

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.editReply({
            content: 'Choose a patchnote node to delete:',
            components: [row]
        });
    }
}

module.exports.PatchNoteDeleteNodeButton = PatchNoteDeleteNodeButton;
