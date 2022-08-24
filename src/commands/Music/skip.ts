import { ApplyOptions } from '@sapphire/decorators'
import { Message, MessageEmbed } from 'discord.js'
import { send } from '@sapphire/plugin-editable-commands'
import BotCommand, { type CustomCommandOptions } from '../../classes/BotCommand'
import type { Queue } from 'discord-music-player'

@ApplyOptions<CustomCommandOptions>({
  name: 'skip',
  description: 'Skips to the next song.',
  fullCategory: ['Music'],
  aliases: ['sk', 'ihatethisone'],
  detailedDescription: 'A command that skips the currently playing.',
})
export class UserCommand extends BotCommand {
  private confirmed: number = 0

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
            .setDescription('What am I supposed to skip, my empty soul? That would kinda useful, unlike your request.'),
        ],
      })

      setTimeout(() => botMessage.delete(), 10 * 1000)

      return botMessage
    }

    const isConfirmed = await this.doVote(queue, message)

    return isConfirmed ? await this.doSkip(queue, message) : undefined
  }

  private async doVote(queue: Queue, message: Message) {
    if (!queue?.connection?.channel) {
      return false
    }

    this.confirmed += 1

    const isRequired = this.confirmed >= Math.ceil(queue.connection.channel.members.size / 2)

    if (!isRequired) {
      const botMessage = await send(message, {
        embeds: [
          new MessageEmbed()
            .setColor('#FFFF00')
            .setTitle('Vote to skip?')
            .setDescription(
              `\`${this.confirmed}/${
                queue.connection.channel.members.size - 1
              }\` people think this song sucks. If you agree, do skip as well.`
            ),
        ],
      })

      setTimeout(() => botMessage.delete(), 30 * 1000)
    }

    return isRequired
  }

  private async doSkip(queue: Queue, message: Message) {
    const song = queue.skip()

    this.confirmed = 0

    const botMessage = await send(message, {
      embeds: [
        new MessageEmbed().setColor('#FF00FF').setTitle('Song skipped').setDescription('Democracy wins again, I guess'),
      ],
    })

    setTimeout(() => botMessage.delete(), 10 * 1000)

    return song
  }
}
