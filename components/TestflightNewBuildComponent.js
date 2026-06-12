const {
    ContainerBuilder,
    TextDisplayBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
} = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const { ForwardToWebsiteButton } = require('../buttons/interactions/ForwardToWebsiteButton');
const ColorManager = require('../managers/ColorManager');

function pickWhatsNew(whatsNew, lang) {
    if (!whatsNew || whatsNew.length === 0) return null;

    const langPrefix = (lang ?? 'en').split('-')[0].toLowerCase();
    const match = whatsNew.find(entry => entry.locale?.toLowerCase().startsWith(langPrefix))
        ?? whatsNew.find(entry => entry.locale?.toLowerCase().startsWith('en'))
        ?? whatsNew[0];

    return match?.text ?? null;
}

class TestflightNewBuildComponent {
    static async create(lang, guildId, build, app = null) {
        const container = new ContainerBuilder();
        if (guildId) container.setAccentColor(await ColorManager.getMainColor(guildId));

        const separator = new SeparatorBuilder({
            spacing: SeparatorSpacingSize.Small,
            divider: true,
        });

        const bannerMedia = new MediaGalleryBuilder();
        bannerMedia.addItems(
            new MediaGalleryItemBuilder().setURL('attachment://cover1.png'),
        );
        container.addMediaGalleryComponents(bannerMedia);
        container.addSeparatorComponents(separator);

        const titleText = LocalisationManager.getString('testflight_new_build_title', lang);
        const title = new TextDisplayBuilder().setContent(
            app?.name ? `### 🚀 ${app.name} — ${titleText}` : `### 🚀 ${titleText}`,
        );
        container.addTextDisplayComponents(title);

        const uploadedTimestamp = build.uploadedDate
            ? Math.floor(new Date(build.uploadedDate).getTime() / 1000)
            : Math.floor(Date.now() / 1000);

        const bodyLines = [
            LocalisationManager.getString('testflight_new_build_body', lang, {
                marketingVersion: build.marketingVersion ?? '—',
                buildNumber: build.buildNumber ?? '—',
                uploadedTimestamp,
                processingState: build.processingState ?? '—',
            }),
        ];

        if (build.expirationDate) {
            const expirationTimestamp = Math.floor(new Date(build.expirationDate).getTime() / 1000);
            bodyLines.push(LocalisationManager.getString('testflight_new_build_expires', lang, {
                expirationTimestamp,
            }));
        }

        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(bodyLines.join('\n')),
        );

        const whatsNewText = pickWhatsNew(build.whatsNew, lang);
        if (whatsNewText) {
            container.addSeparatorComponents(separator);
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent([
                    `**${LocalisationManager.getString('testflight_whats_new_title', lang)}**`,
                    whatsNewText.split('\n').map(line => `> ${line}`).join('\n'),
                ].join('\n')),
            );
        }

        const testflightLink = app?.publicLink || process.env.TESTFLIGHT_PUBLIC_LINK;
        if (testflightLink) {
            container.addActionRowComponents(row => row.addComponents(
                ForwardToWebsiteButton.create(
                    lang,
                    testflightLink,
                    LocalisationManager.getString('testflight_open_button_label', lang),
                ),
            ));
        }

        return container;
    }
}

module.exports.TestflightNewBuildComponent = TestflightNewBuildComponent;
