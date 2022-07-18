import { Args, Command, CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import type { Message } from 'discord.js'
import { send } from '@sapphire/plugin-editable-commands'

@ApplyOptions<CommandOptions>({
  name: 'kick',
  description: 'Kick the user',
  requiredUserPermissions: ['KICK_MEMBERS'],
  requiredClientPermissions: ['KICK_MEMBERS'],
  preconditions: ['MentionOnly', 'NotAgainstGuildOwner', 'NeedHigherPrivilegeThanTargetUser'],
  runIn: CommandOptionsRunTypeEnum.GuildAny,
})
export class UserCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    const member = await args.pick('member')

    const reason = `${message.author.username} kicked ${member.user.username} from server ${message.guild?.name}`

    await member.kick(reason)
    return await send(message, reason)
  }
}
