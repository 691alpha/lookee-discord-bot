const Setups = require('../database/models/Setups');

const DEFAULT_LANG = 'en-US';

class LanguageManager {
    static _cache = new Map();

    static async getServerLang(guildId) {
        if (LanguageManager._cache.has(guildId)) {
            return LanguageManager._cache.get(guildId);
        }

        let lang = DEFAULT_LANG;
        try {
            const setup = await Setups.findOne({ where: { guildId } });
            if (setup?.defaultLang) lang = setup.defaultLang;
        } catch (_) {
            // Setup table may not exist yet on first run — fall back to default.
        }

        LanguageManager._cache.set(guildId, lang);
        return lang;
    }

    static invalidate(guildId) {
        LanguageManager._cache.delete(guildId);
    }

    static get DEFAULT_LANG() {
        return DEFAULT_LANG;
    }
}

module.exports = LanguageManager;
