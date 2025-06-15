const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const PatchNoteNodes = require('../database/models/PatchNoteNodes');
const Setups = require('../database/models/Setups');

class PatchNoteAddNodeModal {
    static customId = "PatchNoteAddNodeModal";
    
    static create(lang, status) {
        
        const modal = new ModalBuilder()
        .setCustomId(`${PatchNoteAddNodeModal.customId}/${status}`)
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
		const { db } = interaction.client;
        const lang = interaction.locale;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const customId = interaction.customId;
        const status = customId.split('/')[1];

        const nodes = [];

        // Creates 5 different input fields
		for (let i = 1; i <= 5; i++) {
            const fieldId = `patchNoteNodeContent${i}`;
            const value = interaction.fields.getTextInputValue(fieldId)?.trim();
            if (value) {
                const patchNoteNodeId = await db.getNextId('patchnote_nodes');
                nodes.push({
                    id: patchNoteNodeId,
                    patchNoteId: null,
                    status,
                    published: false,
                    content: value,
                    authorId: interaction.user.id,
                    guildId: interaction.guild.id
                });
            }
        }

        await PatchNoteNodes.bulkCreate(nodes);

        const server = Setups.findOne({
            where: {guildId: interaction.guild.id}
        });

        PatchnoteUtils.updateAllPatchNotePreviews(
            interaction.guild, 
            interaction.client, 
            server.defaultLang
        );

        await interaction.editReply({
            content: LocalisationManager
            .getString('patchnote_create_success', lang)
            .replace('{count}', nodes.length) // TODO: make enum
            .replace('{status}', LocalisationManager.getString(status, lang))
        });

    }
}

module.exports.PatchNoteAddNodeModal = PatchNoteAddNodeModal;