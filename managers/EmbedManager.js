const fs = require('node:fs');
const path = require('node:path');

/**
 * Singleton, manages localised outputs.
 */
class EmbedManager {

    // Cache
    _embeds = {};
    static _instance;

    /**
     * Loads & cache the language files for future references
     */
    async loadEmbedFiles() {
        
        const embedPath = path.join(__dirname, '..', 'embeds');
        const embedFiles = fs.readdirSync(embedPath).filter(file => file.endsWith('.json'));

        for (const file of embedFiles) {
            const filePath = path.join(embedPath, file);
            const embedFile = require(filePath);
            // get fileName
            let fileName = file.split('.')[0];
            
            Object.keys(embedFile).forEach(key => {
                let color = embedFile[key]["color"];
                if (color.includes("#")) color = color.slice(1, color.length);
                
                color = parseInt(color, 16);
                embedFile[key]["color"] = color;
            });
            
            
            this._embeds[fileName] = embedFile;
        }
    }

    /**
     * Load Embend from embedName File
     * @param {string} embedName 
     * @param {{}} values: optional 
     */
    static getEmbed(key, values) {
        const [fileName, embedkey] = key.split(".");
        const em = EmbedManager.getInstance();
        let currentEmbedFile = em._embeds[fileName];
        let outputEmbed = currentEmbedFile[embedkey] ?? null;

        // let outputString = currentEmbedFile[embedkey] ?? null;

        // if (values) {
        //     Object.entries(values).forEach(entry  => {
        //         const [entryKey, entryValue] = entry;
        //         outputString = outputString.replaceAll(entryKey, entryValue);
        //     });
        // }

        return outputEmbed;

    }

    static getInstance() {
        // Singleton logic
        if (EmbedManager._instance) {
            return EmbedManager._instance;
        } else {
            EmbedManager._instance = new EmbedManager();
            return EmbedManager._instance;
        }
    }

    // Private
    constructor() {
        this.loadEmbedFiles();
    }
} 

module.exports.EmbedManager = EmbedManager;
