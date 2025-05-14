const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const {LocalisationManager} = require('../managers/LocalisationManager.js');

dotenv.config();

module.exports = class Database {
    constructor() {
        this.sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                dialect: 'mysql',
                logging: false
            }
        );
    }

    async authenticate() {
        try {
            await this.sequelize.authenticate();
            console.log(LocalisationManager.getString('database_connection_success', 'en-US'));
        } catch (error) {
            console.error(LocalisationManager.getString('database_connection_fail', 'en-US'), error);
        }
    }
}
