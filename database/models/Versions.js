const { Model, Sequelize } = require("sequelize");

module.exports = class Versions extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            formatId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            major_number: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            feature_number: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            patch_number: {
                type: Sequelize.STRING,
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