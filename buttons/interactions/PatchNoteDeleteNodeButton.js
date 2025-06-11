const { ButtonBuilder, ButtonStyle, MessageFlags, ActionRowBuilder } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const PatchNoteNodes = require("../../database/models/PatchNoteNodes");
const { PatchNoteNodeSelectMenu } = require("../../menus/PatchNoteNodeSelectMenu");
const { PatchnoteUtils } = require("../../utils/PatchnoteUtils");
const { PatchNoteNoNodesComponent } = require("../../components/responses/PatchNoteNoNodesComponent");

class PatchNoteDeleteNodeButton {
    static customId = "PatchNoteDeleteNodeButton";

    static create(lang) {
        
        return new ButtonBuilder()
            .setCustomId(PatchNoteDeleteNodeButton.customId)
            .setLabel(LocalisationManager.getString('delete_node_patchnote_node_button', lang))
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {

        const lang = interaction.locale;
        
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        
        const nodes = await PatchnoteUtils.findAllNodes(interaction.guild.id, lang, 'delete');

        if(!nodes || nodes.length === 0) {
            const container = await PatchNoteNoNodesComponent.create(lang, 'delete');

            return await interaction.editReply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            });
        };

        const selectMenu = PatchNoteNodeSelectMenu.create(lang, nodes, 'delete');

        const row = new ActionRowBuilder().addComponents(selectMenu);

        return await interaction.editReply({
            content: LocalisationManager.getString('patchnote_select_delete_prompt', lang),
            components: [row]
        });
    }
}

module.exports.PatchNoteDeleteNodeButton = PatchNoteDeleteNodeButton;
