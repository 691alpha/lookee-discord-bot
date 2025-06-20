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
                allowNull: false,
            },
            attachmentUrl: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            patchnoteId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            published: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            cleared: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: 'patchnote_attachments',
        });
    }
};
