import { Command, CommandOptions } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { send } from '@sapphire/plugin-editable-commands'
import type { Message } from 'discord.js'
import { DurationFormatter } from '@sapphire/time-utilities';


@ApplyOptions<CommandOptions>({
  name: 'uptime',
  description: 'Tells you how long the bot has been up for.',
})
export class UserCommand extends Command {
  public async messageRun(message: Message) {
    return await send(message, `I'm 🚀 for at least ${new DurationFormatter().format(this.container.client.uptime || 0)}`)
  }
}
