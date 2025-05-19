const { Model, DataTypes, Sequelize } = require("sequelize");

module.exports = class Tickets extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            channelId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            guildId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            discordUsername: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('assigned', 'unassigned', 'closed', 'dropped'),
                allowNull: false,
            },
            category: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            moderator: {
                type: Sequelize.STRING,
                allowNull: true,
            }
        }, {
            sequelize,
            tableName: 'tickets',
        });
    }
}