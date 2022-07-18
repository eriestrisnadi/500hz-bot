import { Args, Command, CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import type { Message } from 'discord.js'
import { send } from '@sapphire/plugin-editable-commands'

@ApplyOptions<CommandOptions>({
  name: 'setnick',
  description: "Changes the user's nickname.",
  requiredUserPermissions: ['MANAGE_NICKNAMES'],
  requiredClientPermissions: ['MANAGE_NICKNAMES'],
  preconditions: ['MentionOnly', 'NeedValidArgument', 'NeedHigherPrivilegeThanTargetUser'],
  runIn: CommandOptionsRunTypeEnum.GuildAny,
})
export class UserCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    const member = await args.pick('member')
    const nickname = await args.rest('string')

    await member.setNickname(nickname)
    return await send(message, `Set ${member.user.username}'s to ${member.user}`)
  }
}
