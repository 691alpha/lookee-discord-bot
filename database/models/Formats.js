const { Model, Sequelize } = require("sequelize");

module.exports = class Formats extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            format: {
                type: Sequelize.STRING,
                allowNull: true,
            }
        }, {
            sequelize,
            tableName: 'formats',
        });
    }
}