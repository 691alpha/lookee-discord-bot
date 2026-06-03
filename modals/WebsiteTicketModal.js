const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    MessageFlags,
} = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const { WebsiteTicketCreatedComponent } = require('../components/WebsiteTicketCreatedComponent');
const { NoVariableResponseComponent } = require('../components/responses/NoVariableResponseComponent');
const { VariableResponseComponent } = require('../components/responses/VariableResponseComponent');
const TicketCooldownManager = require('../managers/TicketCooldownManager');

const API_BASE = process.env.DISPLAY_API_URL || 'https://display-api.lookee-app.com';
const FRONTEND_BASE = process.env.DISPLAY_FRONTEND_URL || 'https://lookee-app.com';
const DISCORD_API_KEY = process.env.DISPLAY_API_DISCORD_KEY;

class WebsiteTicketModal {
    static customId = "WebsiteTicketModal";

    static create(lang, category, { firstName = '', lastName = '' } = {}) {
        const modal = new ModalBuilder()
            .setCustomId(`${WebsiteTicketModal.customId}/category=${category}`)
            .setTitle(LocalisationManager.getString(
                'website_ticket_modal_title',
                lang,
                { 'category': LocalisationManager.getString(`website_ticket_category_${category}`, lang) },
            ));

        const firstNameInput = new TextInputBuilder()
            .setCustomId('websiteTicketFirstName')
            .setLabel(LocalisationManager.getString('website_ticket_modal_input_first_name', lang))
            .setPlaceholder(LocalisationManager.getString('website_ticket_modal_placeholder_first_name', lang))
            .setMinLength(1)
            .setMaxLength(40)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        if (firstName) firstNameInput.setValue(firstName.slice(0, 40));

        const lastNameInput = new TextInputBuilder()
            .setCustomId('websiteTicketLastName')
            .setLabel(LocalisationManager.getString('website_ticket_modal_input_last_name', lang))
            .setPlaceholder(LocalisationManager.getString('website_ticket_modal_placeholder_last_name', lang))
            .setMinLength(1)
            .setMaxLength(40)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        if (lastName) lastNameInput.setValue(lastName.slice(0, 40));

        const emailInput = new TextInputBuilder()
            .setCustomId('websiteTicketEmail')
            .setLabel(LocalisationManager.getString('website_ticket_modal_input_email', lang))
            .setPlaceholder(LocalisationManager.getString('website_ticket_modal_placeholder_email', lang))
            .setMinLength(5)
            .setMaxLength(120)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        const subjectInput = new TextInputBuilder()
            .setCustomId('websiteTicketSubject')
            .setLabel(LocalisationManager.getString('website_ticket_modal_input_subject', lang))
            .setPlaceholder(LocalisationManager.getString('website_ticket_modal_placeholder_subject', lang))
            .setMinLength(5)
            .setMaxLength(120)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        const descriptionInput = new TextInputBuilder()
            .setCustomId('websiteTicketDescription')
            .setLabel(LocalisationManager.getString('website_ticket_modal_input_description', lang))
            .setPlaceholder(LocalisationManager.getString('website_ticket_modal_placeholder_description', lang))
            .setMinLength(10)
            .setMaxLength(1_000)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

        modal.addComponents(
            new ActionRowBuilder().addComponents(firstNameInput),
            new ActionRowBuilder().addComponents(lastNameInput),
            new ActionRowBuilder().addComponents(emailInput),
            new ActionRowBuilder().addComponents(subjectInput),
            new ActionRowBuilder().addComponents(descriptionInput),
        );

        return modal;
    }

    static async onSubmit(interaction, params = {}) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const lang = interaction.locale;
        const category = params.category;
        const guildId = interaction.guild?.id;

        const cooldownSeconds = guildId
            ? await TicketCooldownManager.getCooldownSeconds(guildId)
            : 0;
        const remaining = guildId
            ? TicketCooldownManager.getRemainingSeconds(guildId, interaction.user.id, cooldownSeconds)
            : 0;
        if (remaining > 0) {
            const container = VariableResponseComponent.create(
                'ticket_cooldown_active',
                lang,
                { seconds: remaining, discordTimestamp: Math.floor(Date.now() / 1000) + remaining },
            );
            return interaction.editReply({
                components: [container],
                flags: MessageFlags.IsComponentsV2,
            });
        }

        const firstName = interaction.fields.getTextInputValue('websiteTicketFirstName').trim();
        const lastName = interaction.fields.getTextInputValue('websiteTicketLastName').trim();
        const email = interaction.fields.getTextInputValue('websiteTicketEmail').trim();
        const subject = interaction.fields.getTextInputValue('websiteTicketSubject').trim();
        const description = interaction.fields.getTextInputValue('websiteTicketDescription').trim();

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            const container = NoVariableResponseComponent.create(
                'website_ticket_invalid_email',
                lang,
            );
            return interaction.editReply({
                components: [container],
                flags: MessageFlags.IsComponentsV2,
            });
        }

        let ticketNumber;
        try {
            const res = await fetch(`${API_BASE}/api/ticket/createFromDiscord`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Discord-Api-Key': DISCORD_API_KEY ?? '',
                },
                body: JSON.stringify({
                    email,
                    firstName,
                    lastName,
                    subject,
                    category,
                    description,
                    discordUserId: interaction.user.id,
                    discordUsername: interaction.user.username,
                }),
            });

            if (!res.ok) {
                const body = await res.text().catch(() => '');
                console.error('[WebsiteTicketModal] API error', res.status, body);
                const container = NoVariableResponseComponent.create(
                    'website_ticket_creation_failed',
                    lang,
                );
                return interaction.editReply({
                    components: [container],
                    flags: MessageFlags.IsComponentsV2,
                });
            }

            const data = await res.json();
            ticketNumber = data?.ticket?.ticketNumber;
        } catch (err) {
            console.error('[WebsiteTicketModal] fetch failed', err);
            const container = NoVariableResponseComponent.create(
                'website_ticket_creation_failed',
                lang,
            );
            return interaction.editReply({
                components: [container],
                flags: MessageFlags.IsComponentsV2,
            });
        }

        if (!ticketNumber) {
            const container = NoVariableResponseComponent.create(
                'website_ticket_creation_failed',
                lang,
            );
            return interaction.editReply({
                components: [container],
                flags: MessageFlags.IsComponentsV2,
            });
        }

        const ticketUrl = `${FRONTEND_BASE}/support/conversation/${encodeURIComponent(ticketNumber)}`;
        const successContainer = await WebsiteTicketCreatedComponent.create(
            lang,
            ticketNumber,
            ticketUrl,
            guildId,
        );

        if (guildId) TicketCooldownManager.touch(guildId, interaction.user.id);

        return interaction.editReply({
            components: [successContainer],
            flags: MessageFlags.IsComponentsV2,
        });
    }
}

module.exports.WebsiteTicketModal = WebsiteTicketModal;
