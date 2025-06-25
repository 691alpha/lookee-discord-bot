const { MentionableSelectMenuBuilder, MessageFlags, PermissionsBitField } = require("discord.js");
const { TicketUtils } = require("../utils/TicketUtils");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { VariableResponseComponent } = require("../components/responses/VariableResponseComponent");
const { NoVariableResponseComponent } = require("../components/responses/NoVariableResponseComponent");

class PickUserRemoveSelectionMenu {
    static customId = "PickUserRemoveSelectionMenu";

    static create(lang) {

        return new MentionableSelectMenuBuilder()
            .setCustomId(PickUserRemoveSelectionMenu.customId)
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder(LocalisationManager.getString(
                'select_user_to_remove', 
                lang
            ))
    }

    static async onInteraction(interaction) {
        const userId = interaction.values[0];
        const lang = interaction.locale;

        if (!userId || userId.length === 0) {
            const container = VariableResponseComponent.create(
                'selected_user_not_found', 
                lang, 
                { userId }
            );
            
            interaction.reply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            })
        }

        const guild = await interaction.client.guilds.fetch(interaction.guild.id);
        const guildMember = await guild.members.fetch(userId)

        const memberPermissions = interaction.channel.permissionsFor(guildMember)
        if(!(memberPermissions.has(PermissionsBitField.Flags.ViewChannel))) {
            const container = VariableResponseComponent.create(
                'selected_user_is_not_in_channel', 
                lang, 
                { userId }
            );
            
            return interaction.reply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            })
        }

        if(guildMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const container = VariableResponseComponent.create(
                'selected_user_is_admin_cant_remove', 
                lang, 
                { userId }
            );
            
            return interaction.reply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            })
        }
        
        const ticket = await TicketUtils.findTicketByChannelId(interaction.channel.id, lang);

        if (!ticket) return TicketUtils.searchTicketFail(interaction, lang);

        const member = await interaction.guild.members.fetch(userId).catch(() => null);

        if (!member) {
            const container = NoVariableResponseComponent.create('members_not_found', lang);
            
            interaction.reply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            })
        }

        await interaction.channel.permissionOverwrites.delete(userId);

        const container = VariableResponseComponent.create(
                'user_removed_from_ticket', 
                lang, 
                { userId }
            );

        return await interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        });
    }
}

module.exports.PickUserRemoveSelectionMenu = PickUserRemoveSelectionMenu;
