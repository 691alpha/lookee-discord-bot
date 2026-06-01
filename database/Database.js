const { Sequelize, QueryTypes } = require('sequelize');
const dotenv = require('dotenv');
const { LocalisationManager } = require('../managers/LocalisationManager.js');

const SetupModel = require('./models/Setups.js');
const AutoIncrementModel = require('./models/AutoIncrement.js');
const TicketModel = require('./models/Tickets.js');
const PatchNote = require('./models/PatchNotes.js');
const PatchNoteNode = require('./models/PatchNoteNodes.js');
const PatchNotePreview = require('./models/PatchNotesPreviews.js');
const Formats = require('./models/Formats.js');
const Versions = require('./models/Versions.js');
const Suggestions = require('./models/Suggestions.js');
const PatchNoteCategories = require('./models/PatchNoteCategories.js');
const PatchNoteAttachments = require('./models/PatchNoteAttachments.js');
const TicketCategories = require('./models/TicketCategories.js');
// const Message = require('./models/Messages.js');

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
                this.initConnection(PatchNote);
                this.initConnection(Suggestions);
                this.initConnection(PatchNoteNode);
                this.initConnection(PatchNotePreview);
                this.initConnection(Formats);
                this.initConnection(Versions);
                this.initConnection(PatchNoteCategories);
                this.initConnection(PatchNoteAttachments);
                this.initConnection(TicketCategories);
                // this.initConnection(Message);

                // Foreign keys
                Formats.hasMany(Versions, { foreignKey: 'formatId' });
                Versions.belongsTo(Formats, { foreignKey: 'formatId' });
                
                Versions.hasOne(PatchNote, { foreignKey: 'versionId' });
                PatchNote.belongsTo(Versions, { foreignKey: 'versionId' });

                PatchNote.hasMany(PatchNoteNode, { foreignKey: 'patchnoteId' });
                PatchNoteNode.belongsTo(PatchNote, { foreignKey: 'patchnoteId' });
                
                PatchNote.hasMany(PatchNoteAttachments, { foreignKey: 'patchnoteId' });
                PatchNoteAttachments.belongsTo(PatchNote, { foreignKey: 'patchnoteId' });

                PatchNoteCategories.hasOne(PatchNoteNode, { foreignKey: 'categoryId' });
                PatchNoteNode.belongsTo(PatchNoteCategories, { foreignKey: 'categoryId' });

                TicketCategories.hasOne(TicketModel, { foreignKey: 'categoryId' });
                TicketModel.belongsTo(TicketCategories, { foreignKey: 'categoryId' });

                // TicketModel.hasMany(Message, {foreignKey: 'ticketMessage'});
                // Message.belongsTo(TicketModel, {foreignKey: 'ticketId'});

                await this.sequelize.sync({ force: this.force });
                console.log(this.force ? `Drop and re-sync db.` : "Sync db.")

                await this.ensureModelColumns();

                await this.initAutoIncrement();
                await this.initDefaultPatchNoteVersion();
            }).catch((e) => console.log(e));
        } catch (error) {
            console.error(LocalisationManager.getString('database_connection_fail', 'en-US'), error);
        }
    }

    async getNextId(table) {

        let table_status = await this.sequelize.query(`SELECT ${table} FROM auto_increments`, { type: QueryTypes.SELECT });
        if (table_status == null)
            return 0;

        let ai = table_status[0][table] + 1;
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

    async ensureModelColumns() {
        const queryInterface = this.sequelize.getQueryInterface();
        const models = [
            SetupModel, AutoIncrementModel, TicketModel, PatchNote, Suggestions,
            PatchNoteNode, PatchNotePreview, Formats, Versions,
            PatchNoteCategories, PatchNoteAttachments, TicketCategories,
        ];

        for (const model of models) {
            const tableName = model.getTableName();
            let tableDef;
            try {
                tableDef = await queryInterface.describeTable(tableName);
            } catch (_) {
                continue;
            }

            for (const [attrName, attr] of Object.entries(model.rawAttributes)) {
                const columnName = attr.field || attrName;
                if (tableDef[columnName]) continue;

                try {
                    await queryInterface.addColumn(tableName, columnName, {
                        type: attr.type,
                        allowNull: attr.allowNull !== false,
                        defaultValue: attr.defaultValue,
                    });
                    console.log(`Added missing column \`${columnName}\` to \`${tableName}\`.`);
                } catch (e) {
                    console.error(`Failed to add column \`${columnName}\` to \`${tableName}\`:`, e.message);
                }
            }
        }
    }

    async initAutoIncrement() {
        const data = await AutoIncrementModel.findAll();
        if (data.length == 0) {
            await AutoIncrementModel.create({
                setups: 0,
                tickets: 0,
                messages: 0,
                patchnote_nodes: 0,
                patchnotes: 0,
                versions: 0,
                formats: 0,
                suggestions: 0,
                patchnote_categories: 0,
                patchnote_attachments: 0,
                ticket_categories: 0
            });
        }
    }

    async initDefaultPatchNoteVersion() {
        const foundFormats = await Formats.findAll();
        const foundVersions = await Versions.findAll();
        let format;

        if (foundFormats.length == 0) {
            format = await Formats.create({
                id: await this.getNextId('formats'),
                value: LocalisationManager.getString("db_default_version_format")
            });
            console.log("Default Format created.");
        } else {
            format = await Formats.findOne({
                order: [['createdAt', 'DESC']],
            })
        }

        if (foundVersions.length == 0) {
            await Versions.create({
                id: await this.getNextId('versions'),
                formatId: format.id,
                major_number: 0,
                feature_number: 0,
                patch_number: 0,
                description: LocalisationManager.getString("db_default_version_desc")
            });
            console.log("Default Version created.");
        }
    }
}
