import { ApplyOptions } from '@sapphire/decorators'
import BotCommand, { CustomCommandOptions } from '../../classes/BotCommand'
import { Message, MessageEmbed } from 'discord.js'
import { send } from '@sapphire/plugin-editable-commands'
import type { BotQueue } from '../../classes/BotQueue'

@ApplyOptions<CustomCommandOptions>({
  name: 'playing',
  description: 'Shows info about the currently playing.',
  fullCategory: ['Music'],
  aliases: ['np', 'nowplaying'],
  detailedDescription: 'A command that displays additional information about the currently playing.',
  notes: ['This command displays more information than the "Coming up..." or "Playing..." embed does.'],
})
export class UserCommand extends BotCommand {
  public async messageRun(message: Message) {
    if (!message.guild) {
      return await send(message, {
        embeds: [
          new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Urgh')
            .setDescription('Buddy, this command is not work in DMs'),
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

    return await this.showNowPlaying(queue, message)
  }

  private async showNowPlaying(queue: BotQueue, message: Message) {
    const song = queue.nowPlaying
    const npEmbed = new MessageEmbed().setColor('#FF00FF').setTitle('No Song is playing now')

    if (song) {
      npEmbed
        .setTitle('Currently playing song:')
        .setDescription(
          `**Title:** ${song.name}\n**Channel:** ${song.author}\n\n**Length:** ${queue.customProgressBar().prettier}`
        )
        .setImage(song.thumbnail)
    }

    const botMessage = await send(message, {
      embeds: [npEmbed],
    })

    setTimeout(() => botMessage.delete(), 10 * 1000)

    return botMessage
  }

  progressBar = (queue: BotQueue) => {
    // Puts the O in the place it needs to, depending on how far the playing is
    let progress = '---------'
    const currentTime = queue.nowPlaying!.seekTime + queue.connection!.time
    const percentage = Math.round(10 * (currentTime / queue.nowPlaying!.milliseconds))
    progress = `${progress.slice(0, percentage)}O${progress.slice(percentage)}`
    return progress
  }
}
