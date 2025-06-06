const { MessageFlags, StringSelectMenuBuilder } = require("discord.js");
const PatchNoteNodes = require("../database/models/PatchNoteNodes");
const { LocalisationManager } = require("../managers/LocalisationManager");

class PatchNoteDeleteNodeSelectMenu {
    static customId = "PatchNoteDeleteNodeSelectMenu";

    static create(lang, nodes) {

        return new StringSelectMenuBuilder()
                    .setCustomId(PatchNoteDeleteNodeSelectMenu.customId)
                    .setPlaceholder(LocalisationManager.getString('patchnote_select_delete_placeholder', lang))
                    .addOptions(
                        nodes.slice(0, 25).map(node => ({
                            label: node.content.slice(0, 80),
                            value: node.id.toString(),
                            description: LocalisationManager.getString('patchnote_node_status_description', lang).replace('{status}', node.status),
                        }))
                    );
    }

    static async onInteraction(interaction) {
        const selectedId = interaction.values[0];
        const node = await PatchNoteNodes.findByPk(selectedId);

        const lang = interaction?.locale ?? 'en-US';

        if (!node) {
            throw EmptyResultError(LocalisationManager.getString(
                'patchnote_node_delete_not_found', lang
            ));
        }

        await PatchNoteNodes.update(
            { status: 'deleted' },
            { where: { id: selectedId } }
        );
    }
}

module.exports.PatchNoteDeleteNodeSelectMenu = PatchNoteDeleteNodeSelectMenu;
