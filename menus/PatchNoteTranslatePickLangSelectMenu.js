const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { PatchNoteNoNodesComponent } = require("../components/responses/PatchNoteNoNodesComponent");
const PatchNoteNodes = require("../database/models/PatchNoteNodes");
const translate = require('@iamtraction/google-translate');

class PatchNoteTranslatePickLangSelectMenu {
    static customId = "PatchNoteTranslatePickLangSelectMenu";

    static create(lang, patchnoteId) {
        const menu = new StringSelectMenuBuilder()
            .setCustomId(`${PatchNoteTranslatePickLangSelectMenu.customId}/${patchnoteId}`)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(LocalisationManager.getString(
                        'patchnote_lang_de', lang))
                    .setDescription(LocalisationManager.getString(
                        'patchnote_lang_de_description', lang))
                    .setValue('de'),
                new StringSelectMenuOptionBuilder()
                    .setLabel(LocalisationManager.getString(
                        'patchnote_lang_fr', lang))
                    .setDescription(LocalisationManager.getString(
                        'patchnote_lang_fr_description', lang))
                    .setValue('fr'),
                new StringSelectMenuOptionBuilder()
                    .setLabel(LocalisationManager.getString(
                        'patchnote_lang_discord', lang, {'lang': lang}))
                    .setDescription(LocalisationManager.getString(
                        'patchnote_lang_discord_description', lang, {'lang': lang}))
                    .setValue(lang),
            )
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder(
                LocalisationManager.getString(
                    'patchnote_pick_lang_placeholder', lang)
            )

        return menu;
    }

    static async onInteraction(interaction) {
        await interaction.deferReply({flags: [MessageFlags.Ephemeral]});

        const { PatchNoteComponent } = require("../components/PatchNoteComponent");

        let selectedLang = interaction.values[0]; 
        const [prefix, patchnoteId] = interaction.customId.split('/');
        const lang = interaction.locale;

        const foundNodes = await PatchNoteNodes.findAll({
            where: {patchnoteId: patchnoteId}
        });

        if(!foundNodes || foundNodes.length === 0) {
            const container = PatchNoteNoNodesComponent.create(
                lang, 'translate'
            );

            interaction.editReply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2]
            });
        }
        
        if (selectedLang.includes("-")) selectedLang = selectedLang.split("-")[0];

        const options = { from: 'en', to: selectedLang };

        const separator = "/////////////"
        let mergedNodeStrings = "";
        foundNodes.forEach((node) => {
            mergedNodeStrings += `${node.content}${separator}`;
        });

        let translatedMergedNodeString;
        let translatedNodes;

        try {
            translatedMergedNodeString = await translate(mergedNodeStrings, options);
            translatedNodes = translatedMergedNodeString.text.split(separator);
        } catch (e) {
            interaction.editReply(LocalisationManager.getString('translation_failed', lang))
            return;
        }

        console.log(translatedNodes);
        translatedNodes.forEach((translatedNodeContent, index) => {
            if (translatedNodeContent == "") return;
            foundNodes[index].content = `${translatedNodeContent}`;
        });

        const container = await PatchNoteComponent.create(
            foundNodes,
            selectedLang,
            'translate',
            interaction.guild,
            patchnoteId
        );

        interaction.editReply({
            components: [container],
            flags: [MessageFlags.IsComponentsV2]
        })
    }
}

module.exports.PatchNoteTranslatePickLangSelectMenu = PatchNoteTranslatePickLangSelectMenu;
