const { ButtonBuilder, ButtonStyle, MessageFlags, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const PatchNoteNodes = require("../../database/models/PatchNoteNodes");
const { PatchNoteNodeSelectMenu } = require("../../menus/PatchNoteNodeSelectMenu");
const { PatchnoteUtils } = require("../../utils/PatchnoteUtils");

class PatchNoteEditNodeButton {
    static customId = "PatchNoteEditNodeButton";

    static create(lang) {

        return new ButtonBuilder()
            .setCustomId(PatchNoteEditNodeButton.customId)
            .setLabel(LocalisationManager.getString('edit_node_patchnote_node_button', lang))
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {
        // await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const lang = interaction?.locale ?? 'en-US';

        PatchnoteUtils.findAllNodes(interaction.guild.id, lang, 'edit');

        const nodes = await PatchnoteUtils.findAllNodes(interaction.guild.id, lang, 'edit');

        if(!nodes.length) return;

        const selectMenu = PatchNoteNodeSelectMenu.create(lang, nodes, 'edit')

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({
            content: LocalisationManager.getString('patchnote_select_edit_prompt', lang),
            components: [row],
            flags: MessageFlags.Ephemeral
        });
    }
}

module.exports.PatchNoteEditNodeButton = PatchNoteEditNodeButton;
