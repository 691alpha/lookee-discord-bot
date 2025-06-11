const fs = require('node:fs');
const path = require('node:path');

/**
 * Singleton, manages localised outputs.
 */
class ModalManager {

    // Cache
    _modals = {};
    static _instance;

    /**
     * Loads & cache the language files for future references
     */
    async loadModalFiles() {
        
        const modalsPath = path.join(__dirname, '..', 'modals');
        const modalsFiles = fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'));

        for (const file of modalsFiles) {
            const filePath = path.join(modalsPath, file);
            let fileName = file.split('.')[0];
            
            this._modals[fileName] = require(filePath);
        }
    }

    /**
     * 
     * @param {*} interaction 
     * @returns 
     */
    static async dispatch(interaction) {
        let { customId } = interaction;

        // Splitts the data given in the customId in modal name and parameters
        ModalManager.checkCustomIdLength(customId);
        const {customModalId, params} = ModalManager.getCustomIdData(customId);
        let modal;

        if(customModalId){
            modal = ModalManager.getModal(customModalId);
        } else {
            modal = ModalManager.getModal(customId);
        }
        
        if (!modal) return;
        
        await modal.onSubmit(interaction, params ?? {});
    }

    /**
     * Checks if the CustomId extends the maximum length of a customId from discord
     * @param {string} customId 
     */
    static checkCustomIdLength(customId) {
        if(customId.length > 100) {
            throw new Error("CustomId is too long.");
        }
    }
    /**
     * Extracts the data from a customId by splitting it from the class name
     * @param {*} customId 
     * @returns customId data
     */
    static getCustomIdData(customId) {
        let params = {};
        let id;
        if (customId.includes("/")) {
            let tmp = customId.split("/");
            let key;
            let value;

            // Removes the first element
            id = tmp.shift();

            tmp.forEach((element) => {
                if(!element.includes("=")) return;

                key = element.split('=')[0];
                value = element.split('=')[1];
                params[key] = value;
            });
            return { customModalId: id, params };
        } else {
            return { customId: customId };
        }

    }

    static getModal(key) {
        const mm = ModalManager.getInstance();
        if (Object.keys(mm._modals).includes(key) && Object.keys(mm._modals[key]).includes(key)) {
            return mm._modals[key][key];
        }

        return null;

    }

    static getInstance() {
        // Singleton logic
        if (ModalManager._instance) {
            return ModalManager._instance;
        } else {
            ModalManager._instance = new ModalManager();
            return ModalManager._instance;
        }
    }

    // Private
    constructor() {
        this.loadModalFiles();
    }
} 

module.exports.ModalManager = ModalManager;