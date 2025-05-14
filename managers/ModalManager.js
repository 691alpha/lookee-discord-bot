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

    static dispatch(interaction) {
        const { customId } = interaction;

        const modal = ModalManager.getModal(customId);
        
        if (!modal) return;
        
        modal.onSubmit(interaction);
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