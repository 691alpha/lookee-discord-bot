const { Model, Sequelize } = require("sequelize");

module.exports = class PatchNoteNodes extends Model {

    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            status: {
                type: Sequelize.ENUM('planned', 'done', 'deleted'),
                allowNull: false,
            },
            published: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            deleted: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
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
            tableName: 'patchnote_nodes',
        });
    }
};
