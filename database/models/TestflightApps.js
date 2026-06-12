const { Model, Sequelize } = require("sequelize");

module.exports = class TestflightApps extends Model {

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
            },
            appStoreAppId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            channelId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            publicLink: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            lastBuildId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'testflight_apps',
        });
    }
};
