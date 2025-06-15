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
                        'patchnote_lang_discord', lang, { 'lang': lang }))
                    .setDescription(LocalisationManager.getString(
                        'patchnote_lang_discord_description', lang, { 'lang': lang }))
                    .setValue(`custom_${lang}`),
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
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const { client } = interaction;

        const { PatchNoteComponent } = require("../components/PatchNoteComponent");

        let selectedLang = interaction.values[0];
        if (selectedLang.includes('custom_')) selectedLang = selectedLang.split('custom_')[1]
        const [prefix, patchnoteId] = interaction.customId.split('/');
        const lang = interaction.locale;

        const foundNodes = await PatchNoteNodes.findAll({
            where: { patchnoteId: patchnoteId }
        });

        if (!foundNodes || foundNodes.length === 0) {
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

        const separator = "[THISISASEPARATOR]"
        let mergedNodeStrings = "";
        foundNodes.forEach((node) => {
            mergedNodeStrings += `${node.content}${separator}`;
        });

        let translatedMergedNodeString;
        let translatedNodes;

        // let openAIResponse;
        let mistralResponse;

        try {
            mistralResponse = await client.mistralClient.chat.complete({
                model: "mistral-small-2503",
                response_format: { type: "json_object" },
                messages: [{
                    role: 'system', content: `Translate each line. Return *only* valid json with this exact shape:
                        {
                            "translations": ["<translation-1>", "<translation-2>", …]
                        }`
                }, {
                    role: 'user',
                    content: `(from English to ${selectedLang}) ${mergedNodeStrings}`
                }]
            })

            const raw = mistralResponse.choices[0].message.content;
            let cleaned = raw.replaceAll(/[\n\r]/g, '');
            cleaned = cleaned.replaceAll("```", "");
            cleaned = cleaned.replaceAll("json", "");

            translatedNodes = JSON.parse(cleaned);


            // openAIResponse = await client.openAIClient.responses.create({
            //     model: "gpt-3.5-turbo",
            //     instructions: `You are a translator. Translate the following text to the specified language and return the translated text.\
            //     Do not add any additional text or formatting. Each translation should be separated by the provided separator: ${separator}`,
            //     input: `(from English to ${selectedLang}) ${mergedNodeStrings}`,
            // });
            // translatedNodes = openAIResponse.text.split(separator);


            // translatedMergedNodeString = await translate(mergedNodeStrings, options);
            // translatedNodes = translatedMergedNodeString.text.split(separator);
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
