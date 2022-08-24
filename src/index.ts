import './lib/setup'
import { LogLevel } from '@sapphire/framework'
import { BotClient } from './classes/BotClient'

export const client = new BotClient({
  defaultPrefix: '!',
  regexPrefix: /^hua[,! ]/i,
  caseInsensitiveCommands: true,
  logger: {
    level: LogLevel.Debug,
  },
  shards: 'auto',
  intents: [
    'GUILDS',
    'GUILD_MEMBERS',
    'GUILD_BANS',
    'GUILD_EMOJIS_AND_STICKERS',
    'GUILD_VOICE_STATES',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'DIRECT_MESSAGES',
    'DIRECT_MESSAGE_REACTIONS',
  ],
})

const main = async () => {
  try {
    await client.login()
  } catch (error) {
    client.logger.fatal(error)
    client.destroy()
    process.exit(1)
  }
}

main()
