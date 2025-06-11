const { Model, Sequelize } = require("sequelize");

module.exports = class Versions extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            major_number: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            feature_number: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            patch_number: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false,
            }
        }, {
            sequelize,
            tableName: 'versions',
        });
    }
}