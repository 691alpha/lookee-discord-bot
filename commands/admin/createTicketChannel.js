const {SlashCommandBuilder, MessageFlags, PermissionsBitField, AttachmentBuilder} = require('discord.js');
const path = require('node:path');
const { LocalisationManager } = require("../../managers/LocalisationManager");
const LanguageManager = require('../../managers/LanguageManager');
const { CreateTicketComponent } = require('../../components/CreateTicketComponent.js');
const Setups = require('../../database/models/Setups.js');
const { NoVariableResponseComponent } = require('../../components/responses/NoVariableResponseComponent.js');

// Sends a component to create a new ticket in the current channel

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('create_ticket_channel')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Sends a Ticket embed in the current channel.'),
        // .setDescription(LocalisationManager.getString(
        //         'send_ticket_embed_description', 
        //         lang
        //     )),
    async execute(interaction) {
        const setup = await Setups.findOne({where:{guildId: interaction.guild.id}})
        const serverLang = await LanguageManager.getServerLang(interaction.guild.id);

        let outputContainer = await CreateTicketComponent.create(
            serverLang,
            setup.announcementChannelId,
            interaction.guild.id,
        );

        const bannerAttachment = new AttachmentBuilder(
            path.join(__dirname, '../../assets/images/lookee-banner.jpg'),
        );

        await interaction.channel.send({
            components: [outputContainer],
            files: [bannerAttachment],
            flags: MessageFlags.IsComponentsV2,
        })

        const container = NoVariableResponseComponent.create(
            'create_ticket_message_successfully_sent',
            interaction.locale
        );

        return interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });
    },
};