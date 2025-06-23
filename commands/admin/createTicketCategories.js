const {SlashCommandBuilder, ChannelType, MessageFlags, PermissionsBitField} = require('discord.js');
const { LocalisationManager } = require("../../managers/LocalisationManager");
const Setups = require('../../database/models/Setups');

// Creates all needed categories for the server, doesn't check if they already exist

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('create_ticket_categories')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Creates all needed categories for ticket management.'),
        // .setDescription(LocalisationManager.getString(
        //         'create_categories_description', 
        //         lang
        //     )),
    async execute(interaction) {

        const { db } = interaction.client;
        const guildId = interaction.guild.id;

        let setup = await Setups.findOne({
            where: {guildId: guildId}
        })

        const assignedCategory = await interaction.guild.channels.create({
            name: 'assigned tickets',
            type: ChannelType.GuildCategory,
        });

        const unassignedCategory = await interaction.guild.channels.create({
            name: 'unassigned tickets',
            type: ChannelType.GuildCategory,
        });
        
        const closedCategory = await interaction.guild.channels.create({
            name: 'closed tickets',
            type: ChannelType.GuildCategory,
        });
        if(!setup) {
            
            setup = await Setups.create({
                id: await db.getNextId('setups'),
                guildId: guildId,
                assignedTicketsCategoryId: assignedCategory.id,
                unassignedTicketsCategoryId: unassignedCategory.id,
                closedTicketsCategoryId: closedCategory.id,
                suggestionChannelId: null,
                announcementChannelId: null,
                attachmentChannelId: null,
                logChannelId: null,
                defaultLang: 'en-US',
                patchnoteRoleId: null
            });
            await interaction.reply({
                content: LocalisationManager.getString(
                    'create_categories_success',
                    setup.defaultLang
                ),
                flags: MessageFlags.Ephemeral
            }); 
        } else {
            await setup.update({
                assignedTicketsCategoryId: assignedCategory.id,
                unassignedTicketsCategoryId: unassignedCategory.id,
                closedTicketsCategoryId: closedCategory.id
            });
            await interaction.reply({
                content: LocalisationManager.getString(
                    'updated_categories_success',
                    setup.defaultLang
                ),
                flags: MessageFlags.Ephemeral
            }); 
        }


    },
};