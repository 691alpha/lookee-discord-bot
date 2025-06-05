const { MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const PatchNoteNodes = require("../database/models/PatchNoteNodes");

class PatchNoteDeleteNodeSelectMenu {
    static customId = "PatchNoteDeleteNodeSelectMenu";

    static create(lang, nodes) {
        return new StringSelectMenuBuilder()
                    .setCustomId(PatchNoteDeleteNodeSelectMenu.customId)
                    .setPlaceholder('Select a patch note node to edit...')
                    .addOptions(
                        nodes.slice(0, 25).map(node => ({
                            label: node.content.slice(0, 80),
                            value: node.id.toString(),
                            description: `Status: ${node.status}`,
                        }))
                    );
    }

    static async onInteraction(interaction) {
        const selectedId = interaction.values[0];
        const node = await PatchNoteNodes.findByPk(selectedId);

        if (!node) {
            return interaction.reply({
                content: 'Could not find the selected patch note node.',
                flags: MessageFlags.Ephemeral
            });
        }

        await PatchNoteNodes.update(
            { status: 'deleted' },
            { where: { id: selectedId } }
        );
    }
}

module.exports.PatchNoteDeleteNodeSelectMenu = PatchNoteDeleteNodeSelectMenu;
