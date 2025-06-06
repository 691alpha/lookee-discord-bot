const { ButtonBuilder, ButtonStyle, MessageFlags, ActionRowBuilder } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const PatchNoteNodes = require("../../database/models/PatchNoteNodes");
const { PatchNoteNodeSelectMenu } = require("../../menus/PatchNoteNodeSelectMenu");
const { PatchnoteUtils } = require("../../utils/PatchnoteUtils");

class PatchNoteDeleteNodeButton {
    static customId = "PatchNoteDeleteNodeButton";

    static create(lang) {
        
        return new ButtonBuilder()
            .setCustomId(PatchNoteDeleteNodeButton.customId)
            .setLabel(LocalisationManager.getString('delete_node_patchnote_node_button', lang))
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {

        const lang = interaction?.locale ?? 'en-US';
        
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const nodes = await PatchnoteUtils.findAllNodes(interaction.guild.id, lang, 'delete');

        if(!nodes.length) return;

        const selectMenu = PatchNoteNodeSelectMenu.create(lang, nodes, 'delete');

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.editReply({
            content: LocalisationManager.getString('patchnote_select_delete_prompt', lang),
            components: [row]
        });
    }
}

module.exports.PatchNoteDeleteNodeButton = PatchNoteDeleteNodeButton;
