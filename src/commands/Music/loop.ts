import { ApplyOptions } from '@sapphire/decorators'
import type { Args } from '@sapphire/framework'
import { Message, MessageEmbed } from 'discord.js'
import { send } from '@sapphire/plugin-editable-commands'
import BotCommand, { type CustomCommandOptions } from '../../classes/BotCommand'
import { RepeatMode, type Queue } from 'discord-music-player'

@ApplyOptions<CustomCommandOptions>({
  name: 'loop',
  description: 'Makes the music loop.',
  fullCategory: ['Music'],
  aliases: ['looping', 'repeat'],
  detailedDescription: 'A command that loops the currently playing.',
})
export class UserCommand extends BotCommand {
  modeMap = {
    off: RepeatMode.DISABLED,
    single: RepeatMode.SONG,
    all: RepeatMode.QUEUE,
  }

  public async messageRun(message: Message, args: Args) {
    if (!message.guild) {
      return await send(message, {
        embeds: [
          new MessageEmbed().setColor('#FF0000').setTitle('Urgh').setDescription('Buddy, this command is not in DMs'),
        ],
      })
    }
    const mode = (await args.rest('string').catch(() => '')) as keyof typeof this.modeMap
    const queue = this.container.player.getQueue(message.guild.id)
    const isValid = queue && this.container.player.hasQueue(message.guild.id)

    if (!isValid) {
      const botMessage = await send(message, {
        embeds: [
          new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Urgh')
            .setDescription(
              'To change the loop setting, music needs to be playing. Seriously, why would you change it when it is not even playing?!'
            ),
        ],
      })

      setTimeout(() => botMessage.delete(), 10 * 1000)

      return botMessage
    }

    return await this.setRepeatMode(queue, mode, message)
  }

  private async setRepeatMode(queue: Queue, mode: 'off' | 'single' | 'all', message: Message) {
    queue.setRepeatMode(this.modeMap[mode] || RepeatMode.SONG)

    const botMessage = await send(message, {
      embeds: [
        new MessageEmbed()
          .setColor('#FF00FF')
          .setTitle('Yay!')
          .setDescription(`Looping is set to \`${mode || 'single'}\`.`),
      ],
    })

    setTimeout(() => botMessage.delete(), 10 * 1000)

    return botMessage
  }
}
