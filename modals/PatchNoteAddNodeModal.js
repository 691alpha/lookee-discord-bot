const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const PatchNoteNodes = require('../database/models/PatchNoteNodes');

class PatchNoteAddNodeModal {
    
    static pendingStatuses = new Map();
    static customId = "PatchNoteAddNodeModal";
    
    static create(lang) {
        
        const modal = new ModalBuilder()
        .setCustomId(PatchNoteAddNodeModal.customId)
        .setTitle(LocalisationManager.getString('patchnote_add_node_modal_title', lang));
		
		for (let i = 1; i <= 5; i++) {
            const input = new TextInputBuilder()
            .setCustomId(`patchNoteNodeContent${i}`)
            .setLabel(LocalisationManager.getString('patchnote_add_node_modal_input_label', lang).replace('{index}', i))
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(10)
            .setMaxLength(1000)
            .setRequired(i === 1);
            
            modal.addComponents(new ActionRowBuilder().addComponents(input));
        }
        
        return modal;
	}
    
    static async onSubmit(interaction) {
        
        const { PatchnoteUtils } = require('../utils/PatchnoteUtils');
        
        const lang = interaction?.locale ?? 'en-US';
        
		const { db } = interaction.client;
        
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const status = PatchNoteAddNodeModal.pendingStatuses.get(interaction.user.id) ?? 'planned';
        PatchNoteAddNodeModal.pendingStatuses.delete(interaction.user.id);

        const nodes = [];

		for (let i = 1; i <= 5; i++) {
            const fieldId = `patchNoteNodeContent${i}`;
            const value = interaction.fields.getTextInputValue(fieldId)?.trim();
            if (value) {
                const patchNoteNodeId = await db.getNextId('patchnote_nodes');
                nodes.push({
                    id: patchNoteNodeId,
                    patchNoteId: null,
                    status,
                    content: value,
                    authorId: interaction.user.id,
                    guildId: interaction.guild.id
                });
            }
        }

        await PatchNoteNodes.bulkCreate(nodes);

        PatchnoteUtils.updateAllPatchNotePreviews(interaction);

        await interaction.editReply({
            content: LocalisationManager
            .getString('patchnote_create_success', lang)
            .replace('{count}', nodes.length)
            .replace('{status}', LocalisationManager.getString(status, lang))
        });

    }
}

module.exports.PatchNoteAddNodeModal = PatchNoteAddNodeModal;