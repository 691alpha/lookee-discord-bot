const { ButtonBuilder, ButtonStyle, MessageFlags, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const PatchNoteNodes = require("../../database/models/PatchNoteNodes");
const { PatchNoteNodeSelectMenu } = require("../../menus/PatchNoteNodeSelectMenu");

class PatchNoteEditNodeButton {
    static customId = "PatchNoteEditNodeButton";

    static create(lang) {

        return new ButtonBuilder()
            .setCustomId(PatchNoteEditNodeButton.customId)
            .setLabel(LocalisationManager.getString('edit_node_patchnote_node_button', lang))
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

        const lang = interaction?.locale ?? 'en-US';

        if (!nodes.length) {
            return interaction.editReply({
                content: LocalisationManager.getString('patchnote_no_nodes_edit', lang)
            });
        }

        const selectMenu = PatchNoteNodeSelectMenu.create(lang, nodes, 'edit')

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.editReply({
            content: LocalisationManager.getString('patchnote_select_edit_prompt', lang),
            components: [row]
        });
    }
}

module.exports.PatchNoteEditNodeButton = PatchNoteEditNodeButton;
