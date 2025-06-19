const { Model, Sequelize } = require("sequelize");

module.exports = class Suggestions extends Model {

    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            authorId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            guildId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: 'suggestions',
        });
    }
};
