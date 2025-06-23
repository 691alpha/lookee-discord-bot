const { Model, Sequelize } = require("sequelize");

module.exports = class TicketCategories extends Model {

    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            guildId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            archived: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            }
        }, {
            sequelize,
            tableName: 'ticket_categories',
        });
    }
};
