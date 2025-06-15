const { ButtonBuilder, ButtonStyle, MessageFlags, ActionRowBuilder } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNoteNodeSelectMenu } = require("../../menus/PatchNoteNodeSelectMenu");
const { PatchnoteUtils } = require("../../utils/PatchnoteUtils");
const { PatchNoteNoNodesComponent } = require("../../components/responses/PatchNoteNoNodesComponent");
const { EPatchNoteStatus } = require("../../enums/EPatchNoteStatus");

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
        let nodes;

        if(type === 'Planned') {
            nodes = await PatchnoteUtils.findAllNodes(
                interaction.guild.id, 
                [EPatchNoteStatus.DONE],
                false
            );
        }
            
        if(type === 'Done') {
            nodes = await PatchnoteUtils.findAllNodes(
                interaction.guild.id, 
                [EPatchNoteStatus.PLANNED],
                false
            );
        }
            

        if(!nodes || nodes.length === 0) {
            const container = await PatchNoteNoNodesComponent.create(lang, 'pick status');

            return await interaction.editReply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            });
        };

        const selectMenu = await PatchNoteNodeSelectMenu.create(
            lang, 
            nodes, 
            type, 
            interaction.guild.id
        );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        return await interaction.editReply({
            content: LocalisationManager.getString('patchnote_select_pick_status_prompt', lang),
            components: [row]
        });
    }
}

module.exports.PatchNotePickStatusButton = PatchNotePickStatusButton;
