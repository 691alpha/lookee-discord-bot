const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const Tickets = require("../../database/models/Tickets");
const { VariableResponseComponent } = require("../../components/responses/VariableResponseComponent");
const { NoVariableResponseComponent } = require("../../components/responses/NoVariableResponseComponent");

class TicketTimeoutInfoButton {
    static customId = "TicketTimeoutInfoButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(TicketTimeoutInfoButton.customId)
            .setEmoji('1387416792741318768')
            .setLabel(LocalisationManager.getString('ticket_timeout_info_button_label', lang))
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {
        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        const lang = interaction.locale;

            const ticket = await Tickets.findOne({
                where: {
                    channelId: interaction.channelId,
                    guildId: interaction.guildId,
                    status: "closed"
                }
            });

            if (!ticket) {
                const container = NoVariableResponseComponent.create(
                    'ticket_timeout_info_not_a_ticket',
                    lang,
                )
                return await interaction.editReply({
                    components: [container],
                    flags: [MessageFlags.IsComponentsV2]
                });
            }

            const timeoutThreshold = 1000 * 3600 * 24 * 7;
            const closedAt = new Date(ticket.closedAt).getTime();
            const remainingTime = closedAt + timeoutThreshold - Date.now();

            // const remainingTimeFormatted = this.formatRemainingTime(remainingTime, lang);

            const container = VariableResponseComponent.create(
                'ticket_time_until_timeout',
                lang,
                {
                    // 'remainingTime' : remainingTimeFormatted,
                    'discordTimestamp': Math.floor((closedAt + timeoutThreshold) / 1000)
                }
            );

            interaction.editReply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2]
            });
    }

    /**
     * @deprecated Now uses Discord Timestamps format @ LM(ticket_time_until_timeout)
     */
    static formatRemainingTime(remainingTime, lang) {
        if (remainingTime <= 0) {
            return `0 ${LocalisationManager.getString('minutes', lang)}`;
        }

        const seconds = Math.floor(remainingTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        let format = [];

        if (days > 0) {
            format.push(
                `${days} ${LocalisationManager.getString(days === 1 ? 'day' : 'days', lang)}`
            );
        }
        if(hours % 24 > 0) {
            const remainingHours = hours % 24;
            format.push(
                `${remainingHours} ${LocalisationManager.getString(
                    remainingHours === 1 ? 'hour' : 'hours', lang
                )}`
            );
        }
        if(minutes % 60 > 0) {
            const remainingMinutes = minutes % 60;
            format.push(
                `${remainingMinutes} ${LocalisationManager.getString(
                    remainingMinutes === 1 ? 'minute' : 'minutes', lang
                )}`
            );
        }
        if(format.length < 1) return `${LocalisationManager.getString(
                    'ticket_timeout_less_then_minute', lang
                )}`
        return format;
    }
}

module.exports.TicketTimeoutInfoButton = TicketTimeoutInfoButton;