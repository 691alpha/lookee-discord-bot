const { ButtonBuilder, ButtonStyle, MessageFlags, ActionRowBuilder } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { NoVariableResponseComponent } = require("../../components/responses/NoVariableResponseComponent");
const PatchNoteCategories = require("../../database/models/PatchNoteCategories");
const { SelectMenuComponent } = require("../../components/SelectMenuComponent");
const { DeleteNodeCategorySelectMenu } = require("../../menus/DeleteNodeCategorySelectMenu");

class PatchNoteDeleteCategoryButton {
    static customId = "PatchNoteDeleteCategoryButton";

    static create(lang) {
        
        return new ButtonBuilder()
            .setCustomId(PatchNoteDeleteCategoryButton.customId)
            .setLabel(LocalisationManager.getString(
                'patchnote_delete_node_category_button_label', 
                lang
            ))
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {

        const lang = interaction.locale;
        
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        
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
            'patchnote_select_category_to_delete',
            DeleteNodeCategorySelectMenu,
            lang,
            categories
        );

        interaction.editReply({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
}

module.exports.PatchNoteDeleteCategoryButton = PatchNoteDeleteCategoryButton;
