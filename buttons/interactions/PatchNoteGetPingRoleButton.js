const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { NoVariableResponseComponent } = require("../../components/responses/NoVariableResponseComponent");
const { PatchnoteUtils } = require("../../utils/PatchnoteUtils");

class PatchNoteGetPingRoleButton {
    static customId = "PatchNoteGetPingRoleButton";

    static create(lang) {

        return new ButtonBuilder()
        .setCustomId(`${PatchNoteGetPingRoleButton.customId}`)
        .setLabel(LocalisationManager.getString(
            'patchnote_get_ping_role_button_label', 
            lang
        ))
        .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {
        const lang = interaction.locale;
        // const [prefix, action] = interaction.customId.split(":");
        const newRole = await PatchnoteUtils.checkPatchnoteRole(interaction.guild);

        if(!newRole) {
            return interaction.reply(LocalisationManager.getString(
                'patchnote_no_role_found_contact_staff', 
                lang
            ))
        }

        if(interaction.member.roles.cache.some(role => role.id === newRole.id)) {
            interaction.member.roles.remove(newRole);

            let outputContainer = NoVariableResponseComponent.create(
                'patchnote_ping_role_arl_added', 
                lang
            );

            return await interaction.reply({
                components: [outputContainer],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            })
        }

        interaction.member.roles.add(newRole);


        let outputContainer = NoVariableResponseComponent.create(
            'patchnote_ping_role_added', 
            lang
        );

        return await interaction.reply({
            components: [outputContainer],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        })
    }
}

module.exports.PatchNoteGetPingRoleButton = PatchNoteGetPingRoleButton;