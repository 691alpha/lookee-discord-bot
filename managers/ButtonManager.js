const fs = require('node:fs');
const path = require('node:path');

class ButtonManager {

    _buttons = {};
    static _instance;

    async loadButtonFiles() {
        const buttonPath = path.join(__dirname, '..', 'buttons/interactions');
        const buttonFiles = fs.readdirSync(buttonPath).filter(file => file.endsWith('.js'));

        for (const file of buttonFiles) {
            const filePath = path.join(buttonPath, file);
            let fileName = file.split('.')[0];
            
            this._buttons[fileName] = require(filePath);
        }
    }

    static dispatch(interaction) {
        const { customId } = interaction;

        const button = ButtonManager.getButton(customId);
        
        if (!button) {
            // console.warn(`[ButtonManager] No handler found for ${customId}`);
            return;
        }
        
        button.onInteraction(interaction);
    }

    static getButton(key) {
        const bm = ButtonManager.getInstance();
        if (Object.keys(bm._buttons).includes(key) && Object.keys(bm._buttons[key]).includes(key)) {
            return bm._buttons[key][key];
        }

        return null;
    }

    static getInstance() {
        if (ButtonManager._instance) {
            return ButtonManager._instance;
        } else {
            ButtonManager._instance = new ButtonManager();
            return ButtonManager._instance;
        }
    }

    constructor () {
        this.loadButtonFiles();
    }
}

module.exports.ButtonManager = ButtonManager;