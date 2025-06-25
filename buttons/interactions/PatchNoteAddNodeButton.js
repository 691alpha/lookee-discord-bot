const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { SelectMenuComponent } = require("../../components/SelectMenuComponent");
const { SelectNodeCategorySelectMenu } = require("../../menus/SelectNodeCategorySelectMenu");
const PatchNoteCategories = require("../../database/models/PatchNoteCategories");
const { NoVariableResponseComponent } = require("../../components/responses/NoVariableResponseComponent");

class PatchNoteAddNodeButton {
    static customId = "PatchNoteAddNodeButton";

    static create(lang) {

        return new ButtonBuilder()
        .setCustomId(`${PatchNoteAddNodeButton.customId}`)
        .setEmoji('1387102780740862114')
        .setLabel(LocalisationManager.getString('patchnote_node_pick_status', lang))
        .setStyle(ButtonStyle.Primary);
    }

    static async onInteraction(interaction) {
        const lang =  interaction.locale;

        const categories = await PatchNoteCategories.findAll({
            where: {guildId: interaction.guild.id, archived: false}
        });

        if(!categories || categories.length == 0) {
            const container = NoVariableResponseComponent.create(
                'patchnote_add_node_no_categories',
                lang
            );

            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            });
        }

        const container = await SelectMenuComponent.create(
            'patchnote_select_new_node_category',
            SelectNodeCategorySelectMenu,
            lang,
            categories
        );

        return interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        })
    }
}

module.exports.PatchNoteAddNodeButton = PatchNoteAddNodeButton;