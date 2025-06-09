const { MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const PatchNoteNodes = require("../database/models/PatchNoteNodes");
const { PatchNoteEditNodeModal } = require("../modals/PatchNoteEditNodeModal");
const { ModalManager } = require("../managers/ModalManager");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { PatchnoteUtils } = require("../utils/PatchnoteUtils");
const Versions = require("../database/models/Versions");
const { PatchNoteVersionCreatedComponent } = require("../components/PatchNoteVersionCreatedComponent");

class PatchNoteSelectVersionValueMenu {
    static customId = "PatchNoteSelectVersionValueMenu";

    static create(lang) {
        
        const menu = new StringSelectMenuBuilder()
        .setCustomId(PatchNoteSelectVersionValueMenu.customId)
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Major')
                .setDescription('Major changes including multiple new features or additions.')
                .setValue('major_number'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Feature')
                .setDescription('A group of patches leading to a new functionality.')
                .setValue('feature_number'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Patch')
                .setDescription('A modification or bug-fix to\
                     the server, not worth a full update of its own.')
                .setValue('patch_number'),
        )
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder(
            LocalisationManager.getString('patchnote_increase_version_placeholder'), lang
        )

        return menu;
    }

    static async onInteraction(interaction) {
        const { db } = interaction.client;

        const lang = interaction?.locale ?? 'en-US';

        // TODO: check if array or not
        const selectedValue = interaction.values[0];

        // newValue = Versions[selectedValue] + 1;
        const latestEntry = await Versions.findOne({
            order: [['createdAt', 'DESC']],
        });

        // if (!latestEntry) return interaction.reply("doesnt work help");

        if(!latestEntry) {
            const result = await Versions.create({
                id: await db.getNextId('versions'),
                formatId: '0',
                major_number: '0',
                feature_number: '0',
                patch_number: '0',
                description: 'First Entry'
            });

            const container = await PatchNoteVersionCreatedComponent.create(lang, result);

            interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            });

            return;
        }

        if (latestEntry) {
            latestEntry[selectedValue] = (parseInt(latestEntry[selectedValue]) + 1).toString();
        }

        if(selectedValue === 'major_number') {
            latestEntry['feature_number'] = '0';
            latestEntry['patch_number'] = '0';
        }

        if(selectedValue === 'feature_number') {
            latestEntry['patch_number'] = '0';
        }

        const result = await Versions.create({
            id: await db.getNextId('versions'),
            formatId: latestEntry.formatId,
            major_number: latestEntry.major_number,
            feature_number: latestEntry.feature_number,
            patch_number: latestEntry.patch_number,
            description: latestEntry.description
        });

        const container = await PatchNoteVersionCreatedComponent.create(lang, result);

        PatchnoteUtils.updateAllPatchNotePreviews(interaction);

        interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        })
        // Versions.update({
        //     selectedValue: newValue,
        //     where: {id: Versions[Versions.length-1].id}
        // })
    }
}

module.exports.PatchNoteSelectVersionValueMenu = PatchNoteSelectVersionValueMenu;
