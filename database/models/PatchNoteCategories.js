const { Model, Sequelize } = require("sequelize");

module.exports = class PatchNoteCategories extends Model {

    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            category: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            guildId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: 'patchnote_categories',
        });
    }
};
