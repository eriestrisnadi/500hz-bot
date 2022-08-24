import { ApplyOptions } from '@sapphire/decorators'
import type { Args } from '@sapphire/framework'
import { Message, MessageEmbed } from 'discord.js'
import { send } from '@sapphire/plugin-editable-commands'
import BotCommand, { type CustomCommandOptions } from '../../classes/BotCommand'
import type { Queue } from 'discord-music-player'

@ApplyOptions<CustomCommandOptions>({
  name: 'remove',
  description: 'Remove from the queue.',
  fullCategory: ['Music'],
  aliases: ['rfq'],
  detailedDescription: 'A command that removes a specified from the queue.',
})
export class UserCommand extends BotCommand {
  public async messageRun(message: Message, args: Args) {
    if (!message.guild) {
      return await send(message, {
        embeds: [
          new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Urgh')
            .setDescription('This does not work in DMs, stop doing this!'),
        ],
      })
    }

    const index = await args.pick('number').catch(() => 1)
    const queue = this.container.player.getQueue(message.guild.id)
    const isValid = queue && this.container.player.hasQueue(message.guild.id)

    if (!isValid) {
      const botMessage = await send(message, {
        embeds: [
          new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Urgh')
            .setDescription('I am not good enough to remove something non-existant.'),
        ],
      })

      setTimeout(() => botMessage.delete(), 10 * 1000)
      return botMessage
    }

    return await this.doRemove(queue, index, message)
  }

  private async doRemove(queue: Queue, index: number, message: Message) {
    if (index > queue.songs.length) {
      const botMessage = await send(message, {
        embeds: [
          new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Urgh')
            .setDescription(
              'Just because you entered a number, does not mean I can remove it. Stop thinking I am so dumb, human.'
            ),
        ],
      })

      setTimeout(() => botMessage.delete(), 10 * 1000)

      return botMessage
    }

    const song = queue.remove(index - 1)

    await send(message, {
      embeds: [
        new MessageEmbed()
          .setColor('#FF00FF')
          .setTitle('Song removed')
          .setDescription(`Song **#${index} ${song?.name}** removed from queue.`),
      ],
    })

    if (index === 1) queue.skip()

    return song
  }
}
