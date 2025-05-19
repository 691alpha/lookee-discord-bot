const { Model, DataTypes } = require("sequelize");

module.exports = class Messages extends Model {}

Messages.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        author: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ticket: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'messages',
    }
)