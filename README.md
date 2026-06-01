# lookee-discord-bot

Discord bot for the [Lookee](https://lookee-app.com) community — the equestrian platform for horse owners, riders, and equine professionals.

Built on discord.js v14. Provides community management features: tickets, patch notes, suggestions, welcome/rules, and audit logging.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in the values (Discord token, client/guild IDs, MySQL credentials, Mistral API key).
3. `node deploy-commands.js` to register slash commands.
4. `node index.js` to start the bot.

## Languages

Supports English, French, and German via `langs/`.
