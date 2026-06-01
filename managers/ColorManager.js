const Setups = require('../database/models/Setups');

const DEFAULT_COLOR = 0x006874;

class ColorManager {
    static _cache = new Map();

    static async getMainColor(guildId) {
        if (ColorManager._cache.has(guildId)) {
            return ColorManager._cache.get(guildId);
        }

        let color = DEFAULT_COLOR;
        try {
            const setup = await Setups.findOne({ where: { guildId } });
            const parsed = ColorManager.parseHex(setup?.mainColor);
            if (parsed !== null) color = parsed;
        } catch (_) {
            // Setup table may not exist yet on first run — fall back to default.
        }

        ColorManager._cache.set(guildId, color);
        return color;
    }

    static invalidate(guildId) {
        ColorManager._cache.delete(guildId);
    }

    static parseHex(value) {
        if (!value) return null;
        const match = /^#?([0-9a-fA-F]{6})$/.exec(value);
        if (!match) return null;
        return parseInt(match[1], 16);
    }

    static get DEFAULT_COLOR() {
        return DEFAULT_COLOR;
    }
}

module.exports = ColorManager;
