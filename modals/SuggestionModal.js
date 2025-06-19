const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const Setups = require('../database/models/Setups');
const Suggestions = require('../database/models/Suggestions');
const { NoVariableResponseComponent } = require('../components/responses/NoVariableResponseComponent');
const { SuggestionComponent } = require('../components/SuggestionComponent');

class SuggestionModal {
    static customId = "SuggestionModal";
    
    static create (lang) {

        const modal = new ModalBuilder()
            .setCustomId(SuggestionModal.customId)
            .setTitle(LocalisationManager.getString('suggestion_modal_title', lang));

		const suggestion = new TextInputBuilder()
            .setMinLength(5)
            .setMaxLength(1500)
			.setLabel(LocalisationManager.getString('suggestion_modal_input_title', lang))
			.setCustomId('suggestionModalInput')
            .setPlaceholder(LocalisationManager.getString('suggestion_modal_placeholder', lang))
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

		const firstActionRow = new ActionRowBuilder().addComponents(suggestion);

		modal.addComponents(firstActionRow);

        return modal;
	}

    static async onSubmit(interaction) {
		const { db } = interaction.client;
		const guildId = interaction.guildId.toString(); 
		const setup = await Setups.findOne({ where: { guildId } });
        const lang = interaction.locale;
        let { client } = interaction;

        const newSuggestion = await Suggestions.create({
            id: await db.getNextId('suggestions'),
            content: interaction.fields.getTextInputValue('suggestionModalInput'),
            authorId: interaction.user.id,
            guildId: interaction.guild.id
        });

        if(!newSuggestion) {
            const container = NoVariableResponseComponent.create(
                'suggestions_creation_failed',
                lang
            );

            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            });
        }
        const suggestionChannel = client.channels.cache.get(setup.suggestionChannelId);

        if(!suggestionChannel) {
            const container = NoVariableResponseComponent.create(
                'no_suggestion_channel',
                lang
            );

            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            });
        }

        const container = await SuggestionComponent.create(
            interaction.fields.getTextInputValue('suggestionModalInput'),
            interaction.user,
            lang
        )

        const suggestionMessage = await suggestionChannel.send({
            components: [container],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        });

        if(!suggestionMessage) {
            const container = NoVariableResponseComponent.create(
                'suggestion_message_not_send',
                lang
            );

            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            })
        }

        const responseContainer = NoVariableResponseComponent.create(
            'suggestion_successfully_submitted',
            lang
        );

        interaction.reply({
            components: [responseContainer],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        })
    }
}

module.exports.SuggestionModal = SuggestionModal;