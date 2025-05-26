const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const PatchNoteNodes = require('../database/models/PatchNoteNodes');

class PatchNoteAddNodeModal {

    static pendingStatuses = new Map();

    static create (lang) {

        const modal = new ModalBuilder()
            .setCustomId('PatchNoteAddNodeModal')
            .setTitle(LocalisationManager.getString('patchnote_add_node_modal_title', lang));
		
		const description = new TextInputBuilder()
            .setMinLength(10)
            .setMaxLength(1_000)
			.setLabel(LocalisationManager.getString('patchnote_add_node_modal_input_description', lang))
            .setCustomId('patchNoteAddNodeModalDescription')
            .setPlaceholder(LocalisationManager.getString('patchnote_add_node_modal_placeholder_description', lang))
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

		const firstActionRow = new ActionRowBuilder().addComponents(description);

		modal.addComponents(firstActionRow);

        return modal;
	}

    static async onSubmit(interaction) {
		const { db } = interaction.client;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const status = PatchNoteAddNodeModal.pendingStatuses.get(interaction.user.id) ?? 'planned';
        PatchNoteAddNodeModal.pendingStatuses.delete(interaction.user.id);

		const patchNoteNodeId = await db.getNextId('patchnote_nodes');

		await PatchNoteNodes.create({
            id: patchNoteNodeId,
			patchNoteId: null,
            status: status,
            content: interaction.fields.getTextInputValue('patchNoteAddNodeModalDescription'),
            authorId: interaction.user.id,
            guildId: interaction.guild.id
        })

        await interaction.editReply({
            content: `Patch note node added with status **${status}**.`
        });

    }
}

module.exports.PatchNoteAddNodeModal = PatchNoteAddNodeModal;