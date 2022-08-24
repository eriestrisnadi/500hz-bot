import { ApplyOptions } from '@sapphire/decorators'
import { Message, MessageEmbed } from 'discord.js'
import { send } from '@sapphire/plugin-editable-commands'
import BotCommand, { CustomCommandOptions } from '../../classes/BotCommand'
import type { Queue } from 'discord-music-player'

@ApplyOptions<CustomCommandOptions>({
  name: 'queue',
  description: 'Shows info about the music queue.',
  fullCategory: ['Music'],
  aliases: ['q'],
  detailedDescription: 'A command that displays additional information about the queue.',
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

    return await this.showQueue(queue, message)
  }

  private async showQueue(queue: Queue, message: Message) {
    const queueEmbed = new MessageEmbed()

    for await (const [index, song] of Object.entries(queue.songs)) {
      queueEmbed.addField(`#${+index + 1}`, `**Title:** ${song.name}\n**Duration:** ${song.duration}`)
    }
    const botMessage = await send(message, {
      embeds: [queueEmbed.setColor('#FF00FF').setTitle('Queue:')],
    })

    setTimeout(() => botMessage.delete(), 30 * 1000)

    return botMessage
  }
}
