const { Collection, Events, MessageFlags } = require('discord.js');
const { ModalManager } = require('../managers/ModalManager.js');
const { ButtonManager } = require('../managers/ButtonManager.js');
const { SelectMenuManager } = require('../managers/SelectMenuManager.js');
const { LocalisationManager } = require('../managers/LocalisationManager.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// Checks for the type of interaction and calls according manager
		const lang = interaction.locale;
		
		try {
			if (interaction.isModalSubmit()) await ModalManager.dispatch(interaction);
	
			if (interaction.isButton()) await ButtonManager.dispatch(interaction);
	
			if (interaction.isMentionableSelectMenu() || interaction.isStringSelectMenu())
				await SelectMenuManager.dispatch(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ 
					content: LocalisationManager.getString('error_interaction', lang), 
					flags: MessageFlags.Ephemeral 
				});
			} else {
				await interaction.reply({
					content: LocalisationManager.getString('error_interaction', lang), 
					flags: MessageFlags.Ephemeral 
				});
			}
		}

		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(LocalisationManager.getString(
				'no_matching_command_found', 
				lang, 
				{"interaction.commandName": interaction.commandName}
			));
			return;
		}

        const { cooldowns } = interaction.client;

        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);
                return interaction.reply({
					content: LocalisationManager.getString(
						'on_cooldown', 
						lang,
						{
							"command.data.name": command.data.name, 
							"expiredTimestamp": expiredTimestamp
						}
					), 
					flags: MessageFlags.Ephemeral 
				});
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: LocalisationManager.getString('error_command', lang), 
					flags: MessageFlags.Ephemeral 
				});
			} else {
				await interaction.reply({ 
					content: LocalisationManager.getString('error_command', lang), 
					flags: MessageFlags.Ephemeral 
				});
			}
		}
	},
};