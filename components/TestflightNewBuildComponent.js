const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const ColorManager = require('../managers/ColorManager');

class TestflightNewBuildComponent {
    static async create(lang, guildId, build) {
        const container = new ContainerBuilder();
        if (guildId) container.setAccentColor(await ColorManager.getMainColor(guildId));

        const title = new TextDisplayBuilder().setContent(
            `### ${LocalisationManager.getString('testflight_new_build_title', lang)}`,
        );

        const uploadedTimestamp = build.uploadedDate
            ? Math.floor(new Date(build.uploadedDate).getTime() / 1000)
            : Math.floor(Date.now() / 1000);

        const body = new TextDisplayBuilder().setContent(
            LocalisationManager.getString('testflight_new_build_body', lang, {
                marketingVersion: build.marketingVersion ?? '—',
                buildNumber: build.buildNumber ?? '—',
                uploadedTimestamp,
                processingState: build.processingState ?? '—',
            }),
        );

        container.addTextDisplayComponents(title);
        container.addTextDisplayComponents(body);

        return container;
    }
}

module.exports.TestflightNewBuildComponent = TestflightNewBuildComponent;
