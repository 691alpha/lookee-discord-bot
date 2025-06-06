const {
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    SectionBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder,
} = require('discord.js');
  
const { readFile } = require('node:fs/promises');
const { fileURLToPath } = require('node:url');

class ReleaseComponent {

    static async create() {

        const container = new ContainerBuilder();

        // Header
        const text1 = new TextDisplayBuilder().setContent(
        [
            '# `discord.js` @ `14.19.0` has been released <:CAPV2:1342549467731333172>',
            '-# We were almost on time <a:yippee:1108974025704747009>',
            '*Alongside several other packages: read more on the [releases page](<https://github.com/discordjs/discord.js/releases>)*',
            '-# @everyone',
            '## Notable Changes',
        ].join('\n'),
        );

        container.addTextDisplayComponents(text1);

        // Section 1
        const text2 = new TextDisplayBuilder().setContent(
        ['### `discord.js`', '- Components v2!', '- Soundboards'].join('\n'),
        );

        const changelogButton1 = new ButtonBuilder()
        .setLabel('Changelog')
        .setStyle(ButtonStyle.Link)
        .setURL('https://github.com/discordjs/discord.js/releases/tag/14.19.0');

        const section2 = new SectionBuilder()
        .addTextDisplayComponents(text2)
        .setButtonAccessory(changelogButton1);

        container.addSectionComponents(section2);

        // Separator
        container.addSeparatorComponents(separator =>
        separator.setSpacing(SeparatorSpacingSize.Large),
        );

        // Section 2
        const text3 = new TextDisplayBuilder().setContent(
        ['### `@discordjs/builders`', '- Components v2!'].join('\n'),
        );

        const changelogButton2 = new ButtonBuilder()
        .setLabel('Changelog')
        .setStyle(ButtonStyle.Link)
        .setURL('https://github.com/discordjs/discord.js/releases/tag/%40discordjs%2Fbuilders%401.11.1');

        const section3 = new SectionBuilder()
        .addTextDisplayComponents(text3)
        .setButtonAccessory(changelogButton2);

        container.addSectionComponents(section3);

        return container;
    }
}

module.exports.ReleaseComponent = ReleaseComponent;
