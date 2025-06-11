const { Model, Sequelize } = require("sequelize");

module.exports = class Formats extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            value: {
                type: Sequelize.STRING,
                allowNull: false,
            }
        }, {
            sequelize,
            tableName: 'formats',
        });
    }
}