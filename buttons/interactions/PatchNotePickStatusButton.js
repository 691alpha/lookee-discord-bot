const { ButtonBuilder, ButtonStyle, MessageFlags, ActionRowBuilder } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNoteNodeSelectMenu } = require("../../menus/PatchNoteNodeSelectMenu");
const { PatchnoteUtils } = require("../../utils/PatchnoteUtils");
const { PatchNoteNoNodesComponent } = require("../../components/responses/PatchNoteNoNodesComponent");

class PatchNotePickStatusButton {
    static customId = "PatchNotePickStatusButton";

    static create(lang, type) {

        return new ButtonBuilder()
            .setCustomId(`${PatchNotePickStatusButton.customId}:${type}`)
            .setLabel(LocalisationManager.getString(
                'patchnote_pick_status_button_label', 
                lang,
                {'type': type}
            ))
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const [prefix, type] = interaction.customId.split(":");
        const lang = interaction.locale;
            
        const nodes = await PatchnoteUtils.findAllNodes(
            interaction.guild.id, 
            lang, 
            'pick status'
        );

        if(!nodes || nodes.length === 0) {
            const container = await PatchNoteNoNodesComponent.create(lang, 'pick status');

            return await interaction.editReply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            });
        };

        const selectMenu = PatchNoteNodeSelectMenu.create(lang, nodes, type)

        const row = new ActionRowBuilder().addComponents(selectMenu);

        return await interaction.editReply({
            content: LocalisationManager.getString('patchnote_select_pick_status_prompt', lang),
            components: [row],
            flags: MessageFlags.Ephemeral
        });
    }
}

module.exports.PatchNotePickStatusButton = PatchNotePickStatusButton;
