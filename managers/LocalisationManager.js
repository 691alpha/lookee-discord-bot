const fs = require('node:fs');
const path = require('node:path');

/**
 * Singleton, manages localised outputs.
 */
class LocalisationManager {

    // Cache
    _lang = {};
    static _instance;

    /**
     * Loads & cache the language files for future references
     */
    async loadLanguageFiles() {
        
        const langsPath = path.join(__dirname, '..', 'langs');
        const langFiles = fs.readdirSync(langsPath).filter(file => file.endsWith('.json'));

        for (const file of langFiles) {
            const filePath = path.join(langsPath, file);
            const langFile = require(filePath);
            
            // get fileName
            let fileName = file.split('.')[0];
            this._lang[fileName] = langFile;
        }
    }

    /**
     * Replaces the expected string for the provided key with the provided values. 
     * @param {string} key 
     * @param {string} langKey: optional 
     * @param {{}} values: optional 
     */
    static getString(key, langKey, values) {
        const lm = LocalisationManager.getInstance();
        let currentLangFile = lm._lang[langKey];
        if (!currentLangFile) {
            console.log(`Lang File ${langKey} not implemented yet.`);
            langKey = "en-US";
            currentLangFile = lm._lang[langKey];
        }

        let outputString = currentLangFile[key] ?? null;

        if (!outputString) return lm._lang[langKey]["lm_fallback"];

        if (values) {
            Object.entries(values).forEach(entry  => {
                const [entryKey, entryValue] = entry;
                const brackedEntryKey = `{${entryKey}}`;
                outputString = outputString.replaceAll(brackedEntryKey, entryValue);
            });
        }

        return outputString;
    }

    static getInstance() {
        // Singleton logic
        if (LocalisationManager._instance) {
            return LocalisationManager._instance;
        } else {
            LocalisationManager._instance = new LocalisationManager();
            return LocalisationManager._instance;
        }
    }

    // Private
    constructor() {
        this.loadLanguageFiles();
    }
} 

module.exports.LocalisationManager = LocalisationManager;