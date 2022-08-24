import { ApplyOptions } from '@sapphire/decorators'
import BotCommand, { CustomCommandOptions } from '../../classes/BotCommand'
import { Message, MessageEmbed } from 'discord.js'
import { send } from '@sapphire/plugin-editable-commands'
import type { Queue } from 'discord-music-player'

@ApplyOptions<CustomCommandOptions>({
  name: 'leave',
  description: 'Makes the bot leave the VC.',
  fullCategory: ['Music'],
  aliases: ['stop', 'disconnect', 'dc', 'bye'],
  detailedDescription: 'A command that disconnects the bot from the voice channel.',
  notes: ['When the bot leaves, the queue gets deleted as well.'],
})
export class UserCommand extends BotCommand {
  public async messageRun(message: Message) {
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

    const queue = this.container.player.getQueue(message.guild.id)
    const isValid = queue && queue.connection?.channel

    if (!isValid) {
      const botMessage = await send(message, {
        embeds: [
          new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Urgh')
            .setDescription("I'm not even in the VC, why are you doing this!"),
        ],
      })

      setTimeout(() => botMessage.delete(), 10 * 1000)

      return botMessage
    }

    return await this.doLeave(queue, message)
  }

  private async doLeave(queue: Queue, message: Message) {
    if (message.member?.voice.channel !== queue.connection?.channel) {
      const botMessage = await send(message, {
        embeds: [
          new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Urgh')
            .setDescription('Nice try buddy, you need to join VC to do that.'),
        ],
      })

      setTimeout(() => botMessage.delete(), 10 * 1000)

      return botMessage
    }

    queue.player.on('queueEnd', () =>
      setTimeout(
        async () =>
          await send(message, {
            embeds: [
              new MessageEmbed()
                .setColor('#FF00FF')
                .setTitle('Yeet')
                .setDescription("Fine, guess I'll go. Not like I wanted to stay!"),
            ],
          }),
        queue.player.options.timeout
      )
    )

    queue.clearQueue()
    queue.skip()
    queue.stop()

    return
  }
}
