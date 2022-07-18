import { Command, CommandOptions } from '@sapphire/framework'
import { isMessageInstance } from '@sapphire/discord.js-utilities'
import { ApplyOptions } from '@sapphire/decorators'
import { send } from '@sapphire/plugin-editable-commands'
import type { Message } from 'discord.js'

interface MessageTimestamp {
  createdTimestamp: number
  editedTimestamp?: number | null
}

@ApplyOptions<CommandOptions>({
  name: 'ping',
  description: 'ping pong',
})
export class UserCommand extends Command {
  public async messageRun(message: Message) {
    const msg = await send(message, 'Ping?')

    if (!isMessageInstance(msg)) return await send(message, 'Failed to retrieve ping :(')

    const content = this.printPing(msg, message)

    return await send(message, content)
  }

  private printPing(n1: MessageTimestamp, n2: MessageTimestamp) {
    const diff = (n1.editedTimestamp || n1.createdTimestamp) - (n2.editedTimestamp || n2.createdTimestamp)
    const ping = Math.round(this.container.client.ws.ping)

    return `Pong 🏓! (Round trip took: ${diff}ms. Heartbeat: ${ping}ms.)`
  }
}
