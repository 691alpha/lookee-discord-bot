const { ButtonBuilder, ButtonStyle, MessageFlags, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { ChangeNodeCategorySelectMenu } = require("../../menus/ChangeNodeCategorySelectMenu");
const PatchNoteCategories = require("../../database/models/PatchNoteCategories");
const { SelectMenuComponent } = require("../../components/SelectMenuComponent");

class PatchNoteChangeCategoryButton {
    static customId = "PatchNoteChangeCategoryButton";

    static create(lang) {

        return new ButtonBuilder()
            .setCustomId(PatchNoteChangeCategoryButton.customId)
            .setLabel(LocalisationManager.getString(
                'patchnote_change_category_button_label', 
                lang
            ))
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const lang = interaction.locale;

        const categories = await PatchNoteCategories.findAll({
            where: {guildId: interaction.guild.id}
        });

        if(!categories || categories.length === 0) {
            const container = NoVariableResponseComponent.create(
                'patchnode_delete_categories_not_found',
                lang
            );

            return interaction.editReply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2]
            });
        }
            
        const container = await SelectMenuComponent.create(
            'patchnote_select_new_node_category',
            ChangeNodeCategorySelectMenu,
            lang,
            categories
        );

        return interaction.editReply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        })
    }
}

module.exports.PatchNoteChangeCategoryButton = PatchNoteChangeCategoryButton;
