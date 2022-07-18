import { Args, Command, CommandOptions, Precondition } from '@sapphire/framework'
import type { Message } from 'discord.js'
import { createArgsFromPrecondition } from '../lib/utils'

export class UserPrecondition extends Precondition {
  public async run(message: Message, command: Command<Args, CommandOptions>, context: any) {
    const args = createArgsFromPrecondition(message, command, context)
    const member = await args.pick('member')
    const privilegeIsHigher = member.roles.highest.position > message.guild!.me!.roles.highest.position

    return !privilegeIsHigher ? this.ok() : this.error({ message: 'I do not have permission due too low privilege.' })
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    NeedHigherPrivilegeThanTargetUser: never
  }
}
