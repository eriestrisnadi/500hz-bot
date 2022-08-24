import { ApplyOptions } from '@sapphire/decorators'
import { Message, MessageEmbed } from 'discord.js'
import { send } from '@sapphire/plugin-editable-commands'
import BotCommand, { CustomCommandOptions } from '../../classes/BotCommand'
import type { Queue } from 'discord-music-player'

@ApplyOptions<CustomCommandOptions>({
  name: 'shuffle',
  description: 'Shuffle the queue.',
  fullCategory: ['Music'],
  aliases: ['sf'],
  detailedDescription: 'A command that shuffle the queue.',
})
export class UserCommand extends BotCommand {
  public async messageRun(message: Message) {
    if (!message.guild) {
      return await send(message, {
        embeds: [
          new MessageEmbed().setColor('#FF0000').setTitle('Urgh').setDescription('Buddy, this command is not in DMs'),
        ],
      })
    }

    const queue = this.container.player.getQueue(message.guild.id)
    const isValid = queue && this.container.player.hasQueue(message.guild.id)

    if (!isValid) {
      const botMessage = await send(message, {
        embeds: [
          new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Urgh')
            .setDescription(
              'You are not fooling me, there is no queue. If this is entertainment for you, go touch grass.'
            ),
        ],
      })

      setTimeout(() => botMessage.delete(), 10 * 1000)

      return botMessage
    }

    return await this.doShuffle(queue, message)
  }

  private async doShuffle(queue: Queue, message: Message) {
    queue.shuffle()
    const queueEmbed = new MessageEmbed()

    for await (const [index, song] of Object.entries(queue.songs)) {
      queueEmbed.addField(`#${+index + 1}`, `**Title:** ${song.name}\n**Duration:** ${song.duration}`)
    }
    const botMessage = await send(message, {
      embeds: [queueEmbed.setColor('#FF00FF').setTitle('Updated queue to:')],
    })

    setTimeout(() => botMessage.delete(), 30 * 1000)

    return botMessage
  }
}
