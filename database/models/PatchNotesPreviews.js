const { Model, Sequelize } = require("sequelize");

module.exports = class PatchNotePreviews extends Model {

    static init(sequelize) {
        return super.init({
            messageId: { 
                type: Sequelize.STRING, 
                allowNull: false,
                primaryKey: true,
            },
            guildId: { 
                type: Sequelize.STRING, 
                allowNull: false,
            },
            channelId: { 
                type: Sequelize.STRING, 
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: 'patchnote_previews',
        });
    }
};
