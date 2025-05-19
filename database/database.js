const { Sequelize, QueryTypes } = require('sequelize');
const dotenv = require('dotenv');
const {LocalisationManager} = require('../managers/LocalisationManager.js');

const SetupModel = require('./models/Setups.js');
const AutoIncrementModel = require('./models/AutoIncrement.js');
const TicketModel = require('./models/Tickets.js');

dotenv.config();

module.exports = class Database {
    force = false;

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
            await this.sequelize.authenticate().then(async () => {
                console.log(LocalisationManager.getString('database_connection_success', 'en-US'));
                
                this.initConnection(SetupModel);
                this.initConnection(AutoIncrementModel);
                this.initConnection(TicketModel);
            
                await this.sequelize.sync({force: this.force});
                console.log(this.force ? `Drop and re-sync db.` : "Sync db.")

                this.initAutoIncrement();
            }).catch((e) => console.log(e));
        } catch (error) {
            console.error(LocalisationManager.getString('database_connection_fail', 'en-US'), error);
        }
    }

    async getNextId(table) {

        let table_status = await this.sequelize.query(`SELECT ${table} FROM auto_increments`, { type: QueryTypes.SELECT });
        if (table_status == null)
            return 0;

        let ai = table_status[0][table]+1;
        this.sequelize.query(`UPDATE auto_increments SET ${table} = ${ai} LIMIT 1`);

        let date = BigInt(Date.now());
        let shardId = BigInt(1010);
        
        let id = date << BigInt(64 - 41);
        id |= shardId << BigInt(64 - 41 - 13);
        id |= BigInt(ai % 1024);
        
        return id.toString();
    }

    initConnection(database) {
        database.init(this.sequelize);
        // database.sync();
    }

    initAutoIncrement() {
        AutoIncrementModel.findAll().then(data => {
            if(data.length == 0) AutoIncrementModel.create({
                setups: 0,
                tickets: 0,
                messages: 0
            });
        });
    }
}
