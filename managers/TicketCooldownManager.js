const Setups = require('../database/models/Setups');

class TicketCooldownManager {
    static _lastCreated = new Map();

    static _key(guildId, userId) {
        return `${guildId}:${userId}`;
    }

    static async getCooldownSeconds(guildId) {
        const setup = await Setups.findOne({ where: { guildId } });
        const value = setup?.ticketCooldownSeconds;
        return Number.isInteger(value) && value > 0 ? value : 0;
    }

    static getRemainingSeconds(guildId, userId, cooldownSeconds) {
        if (!cooldownSeconds) return 0;
        const last = TicketCooldownManager._lastCreated.get(TicketCooldownManager._key(guildId, userId));
        if (!last) return 0;

        const elapsed = (Date.now() - last) / 1000;
        const remaining = Math.ceil(cooldownSeconds - elapsed);
        return remaining > 0 ? remaining : 0;
    }

    static touch(guildId, userId) {
        TicketCooldownManager._lastCreated.set(TicketCooldownManager._key(guildId, userId), Date.now());
    }
}

module.exports = TicketCooldownManager;
