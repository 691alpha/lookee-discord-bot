const {SlashCommandBuilder, MessageFlags, PermissionsBitField, AttachmentBuilder} = require('discord.js');
const path = require('node:path');
const { LocalisationManager } = require("../../managers/LocalisationManager");
const LanguageManager = require('../../managers/LanguageManager');
const { CreateTicketComponent } = require('../../components/CreateTicketComponent.js');
const Setups = require('../../database/models/Setups.js');
const { NoVariableResponseComponent } = require('../../components/responses/NoVariableResponseComponent.js');

const TICKET_MODES = ['native', 'website'];

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('create_ticket_channel')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Sends a Ticket embed in the current channel.')
        .addStringOption(option =>
            option
                .setName('mode')
                .setDescription('Which ticketing system the button should use.')
                .setRequired(true)
                .addChoices(
                    { name: 'Discord (native channels)', value: 'native' },
                    { name: 'Website (lookee-app.com)', value: 'website' },
                )
        ),
    async execute(interaction) {
        const mode = interaction.options.getString('mode');
        if (!TICKET_MODES.includes(mode)) {
            return interaction.reply({
                content: 'Invalid mode.',
                flags: MessageFlags.Ephemeral,
            });
        }

        const setup = await Setups.findOne({where:{guildId: interaction.guild.id}})
        const serverLang = await LanguageManager.getServerLang(interaction.guild.id);

        await Setups.update(
            { ticketMode: mode },
            { where: { guildId: interaction.guild.id } },
        );

        let outputContainer = await CreateTicketComponent.create(
            serverLang,
            setup.announcementChannelId,
            interaction.guild.id,
            mode,
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
