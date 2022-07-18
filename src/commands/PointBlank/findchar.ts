import { Args, Command, CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { send } from '@sapphire/plugin-editable-commands'
import { Message, MessageEmbed } from 'discord.js'
import { findNickName } from '../../lib/api/pb'
import { escapeCodeBlockMarkdown } from '../../lib/utils'

@ApplyOptions<CommandOptions>({
  name: 'findchar',
  description: 'Find PointBlank User Detail by Nick Name',
  preconditions: [],
  runIn: CommandOptionsRunTypeEnum.GuildAny,
})
export class UserCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    const nickName = await args.pick('string')
    const player = await findNickName(nickName)

    if (Object.prototype.toString.call(player) !== '[object Object]') return await send(message, 'Player not found')

    const templateMessage = Object.entries(player!)
      .map(([key, value]) => `${key}: ${escapeCodeBlockMarkdown(value)}`)
      .join('\n')

    return await send(message, {
      embeds: [new MessageEmbed().setTitle(nickName).setDescription(templateMessage)],
    })
  }
}
