import { Args, Command, CommandOptions, CommandOptionsRunTypeEnum } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { findNickName } from '../../lib/api/pb'
import type { Message } from 'discord.js'
import { send } from '@sapphire/plugin-editable-commands'
import { envParseArray } from '../../lib/env-parser'
import { assignRoles, removeRoles } from '../../lib/utils'

const VERIFIED_ROLE_NAMES = envParseArray('VERIFIED_ROLE_NAMES')
const UNVERIFIED_ROLE_NAMES = envParseArray('UNVERIFIED_ROLE_NAMES')

@ApplyOptions<CommandOptions>({
  name: 'verifchar',
  description: 'Char Verification PointBlank by Nick Name',
  requiredUserPermissions: [],
  requiredClientPermissions: ['MANAGE_ROLES', 'MANAGE_NICKNAMES'],
  preconditions: ['IntroChannelOnly'],
  runIn: CommandOptionsRunTypeEnum.GuildAny,
})
export class UserCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    const nickName = await args.pick('string')
    const player = await findNickName(nickName)

    await message.guild?.roles.fetch()
    await message.guild?.members.fetch()

    const existingMember = message.guild?.roles.cache
      .find((role) => VERIFIED_ROLE_NAMES.map((v) => String(v || '').toLowerCase()).includes(role.name.toLowerCase()))
      ?.members.find((member) => member.nickname === nickName)

    if (typeof existingMember !== 'undefined') {
      return await send(
        message,
        `Player has already claimed by ${existingMember.user}, please try another nickname instead.`
      )
    }

    if (Object.prototype.toString.call(player) !== '[object Object]') {
      await assignRoles(message.member!, UNVERIFIED_ROLE_NAMES)
      await removeRoles(message.member!, VERIFIED_ROLE_NAMES)
    }

    await assignRoles(message.member!, VERIFIED_ROLE_NAMES)
    await removeRoles(message.member!, UNVERIFIED_ROLE_NAMES)
    await message.member?.setNickname(player?.nickname!)

    return await send(message, `Account ${message.member?.user} verified as player ${player?.nickname}.`)
  }
}
