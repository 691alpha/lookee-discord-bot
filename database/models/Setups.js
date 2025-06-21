const { Model, Sequelize } = require("sequelize");

module.exports = class Setups extends Model {

    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            guildId: {
                type: Sequelize.STRING,
                allowNull: false,
                field: 'guildId'
            },
            unassignedTicketsCategoryId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            suggestionChannelId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            attachmentChannelId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            assignedTicketsCategoryId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            closedTicketsCategoryId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            announcementChannelId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            logChannelId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            defaultLang: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            patchnoteRoleId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'setups',
        });
    }
};
