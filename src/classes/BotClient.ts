import { SapphireClient, container } from '@sapphire/framework'
import type { ClientOptions } from 'discord.js'
import { BotPlayer } from './BotPlayer'

export class BotClient extends SapphireClient {
  public constructor(options: ClientOptions) {
    // We call super our options
    super(options)
  }

  public override async login(token?: string) {
    container.player = new BotPlayer(container.client, {
      timeout: 1 * (60 * 1000),
    })
    return super.login(token)
  }
}

declare module '@sapphire/pieces' {
  interface Container {
    player: BotPlayer
  }
}
