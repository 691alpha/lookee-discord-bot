const { SlashCommandBuilder, ActionRowBuilder, PermissionsBitField } = require('discord.js');
// const { ConfirmButton } = require('../../buttons/components/ConfirmButton');
// const { CancelButton } = require('../../buttons/components/CancelButton');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Tests modal.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the kick')
                .setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const member = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        const row = new ActionRowBuilder()
                    // .addComponents(ConfirmButton.create())
                    // .addComponents(CancelButton.create());
        

        const response = await interaction.reply({
            content: `Are you sure you want to kick ${target} for reason: ${reason}?`,
            components: [row],
            withResponse: true,
        });

        const collectorFilter = i => i.user.id === interaction.user.id;
        
        try {
            const component = await response.resource.message.awaitMessageComponent({filter: collectorFilter, time: 60_000 }) 
            
            ConfirmButton.onComponentInteraction(component, () => {
                member.kick();
                component.update({ content: `${target.username} has been kicked for reason: ${reason}`, components: [] })
            });

            CancelButton.onComponentInteraction(component, () => {
                component.update({ content: 'Action cancelled', components: [] });
            });


        } catch (e) {
            interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }
    },
};