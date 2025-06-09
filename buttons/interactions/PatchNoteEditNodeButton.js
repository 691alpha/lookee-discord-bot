const { ButtonBuilder, ButtonStyle, MessageFlags, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const PatchNoteNodes = require("../../database/models/PatchNoteNodes");
const { PatchNoteNodeSelectMenu } = require("../../menus/PatchNoteNodeSelectMenu");
const { PatchnoteUtils } = require("../../utils/PatchnoteUtils");
const { PatchNoteNoNodesComponent } = require("../../components/PatchNoteNoNodesComponent");

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
        const lang = interaction?.locale ?? 'en-US';

        try {
            
            const nodes = await PatchnoteUtils.findAllNodes(interaction.guild.id, lang, 'edit');

            if(!nodes.length) return;

            const selectMenu = PatchNoteNodeSelectMenu.create(lang, nodes, 'edit')

            const row = new ActionRowBuilder().addComponents(selectMenu);

            await interaction.editReply({
                content: LocalisationManager.getString('patchnote_select_edit_prompt', lang),
                components: [row],
                flags: MessageFlags.Ephemeral
            });
        } catch (error) {
            const container = await PatchNoteNoNodesComponent.create(lang, 'edit');

            await interaction.editReply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            });
        }
    }
}

module.exports.PatchNoteEditNodeButton = PatchNoteEditNodeButton;
