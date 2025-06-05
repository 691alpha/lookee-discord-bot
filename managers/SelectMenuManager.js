const fs = require('node:fs');
const path = require('node:path');

class SelectMenuManager {

    _menus = {};
    static _instance;

    async loadSelectMenuFiles() {
        const menusPath = path.join(__dirname, '..', 'menus');
        const menuFiles = fs.readdirSync(menusPath).filter(file => file.endsWith('.js'));

        for (const file of menuFiles) {
            const filePath = path.join(menusPath, file);
            const fileName = file.split('.')[0];

            this._menus[fileName] = require(filePath);
        }
    }

    static dispatch(interaction) {
        const fullId = interaction.customId;
        const prefix = fullId.split("/")[0];

        const menu = SelectMenuManager.getMenu(prefix);

        if (!menu) return;

        menu.onInteraction(interaction);
    }

    static getMenu(key) {
        const sm = SelectMenuManager.getInstance();
        if (Object.keys(sm._menus).includes(key) && Object.keys(sm._menus[key]).includes(key)) {
            return sm._menus[key][key];
        }

        return null;
    }

    static getInstance() {
        if (!SelectMenuManager._instance) {
            SelectMenuManager._instance = new SelectMenuManager();
        }
        return SelectMenuManager._instance;
    }

    constructor() {
        this.loadSelectMenuFiles();
    }
}

module.exports.SelectMenuManager = SelectMenuManager;