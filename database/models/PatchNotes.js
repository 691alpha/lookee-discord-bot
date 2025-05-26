const { Model, Sequelize } = require("sequelize");

module.exports = class PatchNotes extends Model {

    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            publishedDate: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            channelId: {
                type: Sequelize.STRING,
                allowNull: true,
            }
        }, {
            sequelize,
            tableName: 'patchnotes',
        });
    }
};
