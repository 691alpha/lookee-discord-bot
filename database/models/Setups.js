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
            unsolvedTicketsId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            solvedTicketsId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            closedTicketsId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            defaultLang: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: 'setups',
        });
    }
};
