const { Model, Sequelize } = require("sequelize");

module.exports = class PatchNoteAttachments extends Model {

    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
            },
            guildId: {
                type: Sequelize.STRING,
            },
            attachmentUrl: {
                type: Sequelize.STRING,
            },
            patchnoteId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            published: {
                type: Sequelize.BOOLEAN,
            },
            cleared: {
                type: Sequelize.BOOLEAN,
            },
        }, {
            sequelize,
            tableName: 'patchnote_attachments',
        });
    }
};
