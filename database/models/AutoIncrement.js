const { Sequelize, Model } = require("sequelize");

module.exports = class AutoIncrement extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      messages: {
        type: Sequelize.BIGINT,
      },
      setups: {
        type: Sequelize.BIGINT,
      },
      tickets: {
        type: Sequelize.BIGINT,
      },
      patchnote_nodes: {
        type: Sequelize.BIGINT,
      },
      patchnotes: {
        type: Sequelize.BIGINT,
      },
      versions: {
        type: Sequelize.BIGINT,
      },
      formats: {
        type: Sequelize.BIGINT,
      },
      suggestions: {
        type: Sequelize.BIGINT,
      },
    }, {
      sequelize,
      tableName: 'auto_increments',
    });
  }
};