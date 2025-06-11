const { MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { PatchnoteUtils } = require("../utils/PatchnoteUtils");
const { PatchNoteVersionCreatedComponent } = require("../components/responses/PatchNoteVersionCreatedComponent");
const Versions = require("../database/models/Versions");
const { NoVariableResponseComponent } = require("../components/responses/NoVariableResponseComponent");

class PatchNoteSelectVersionValueMenu {
    static customId = "PatchNoteSelectVersionValueMenu";

    static create(lang) {
        const menu = new StringSelectMenuBuilder()
            .setCustomId(PatchNoteSelectVersionValueMenu.customId)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(LocalisationManager.getString(
                        'patchnote_version_major_label', lang))
                    .setDescription(LocalisationManager.getString(
                        'patchnote_version_major_description', lang))
                    .setValue('major_number'),
                new StringSelectMenuOptionBuilder()
                    .setLabel(LocalisationManager.getString(
                        'patchnote_version_feature_label', lang))
                    .setDescription(LocalisationManager.getString(
                        'patchnote_version_feature_description', lang))
                    .setValue('feature_number'),
                new StringSelectMenuOptionBuilder()
                    .setLabel(LocalisationManager.getString(
                        'patchnote_version_patch_label', lang))
                    .setDescription(LocalisationManager.getString(
                        'patchnote_version_patch_description', lang))
                    .setValue('patch_number'),
            )
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder(
                LocalisationManager.getString(
                    'patchnote_increase_version_placeholder', lang)
            )

        return menu;
    }

    static async onInteraction(interaction) {
        const { db } = interaction.client;
        const lang = interaction.locale;
        const selectedValue = interaction.values[0];

        const latestEntry = await Versions.findOne({
            order: [['createdAt', 'DESC']],
        });

        if(!latestEntry) {
            const container = NoVariableResponseComponent.create(
                'no_entry_for_version_found', 
                lang
            );

            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            });
        }
 
        latestEntry[selectedValue] = (parseInt(latestEntry[selectedValue]) + 1).toString();
        
        switch(selectedValue) {
            case 'major_number':
                latestEntry['feature_number'] = '0';
                latestEntry['patch_number'] = '0';
                break;
            case 'feature_number':
                latestEntry['patch_number'] = '0';
                break; 
        }

        const creationResult = await Versions.create({
            id: await db.getNextId('versions'),
            formatId: latestEntry.formatId,
            major_number: latestEntry.major_number,
            feature_number: latestEntry.feature_number,
            patch_number: latestEntry.patch_number,
            description: latestEntry.description
        });

        PatchnoteUtils.updateAllPatchNotePreviews(interaction.guild.id, interaction.client, lang);
        
        const container = await PatchNoteVersionCreatedComponent.create(lang, creationResult);
        
        interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        })
    }
}

module.exports.PatchNoteSelectVersionValueMenu = PatchNoteSelectVersionValueMenu;
