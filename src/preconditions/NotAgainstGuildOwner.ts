import { Args, Command, CommandOptions, Precondition } from '@sapphire/framework'
import type { Message } from 'discord.js'
import { createArgsFromPrecondition } from '../lib/utils'

export class UserPrecondition extends Precondition {
  public async run(message: Message, command: Command<Args, CommandOptions>, context: any) {
    const args = createArgsFromPrecondition(message, command, context)
    const member = await args.pick('member')

    if (member.id === message.guild?.ownerId)
      return this.error({ message: 'You might crazy to against the Almighty one! LOL' })

    return this.ok()
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    NotAgainstGuildOwner: never
  }
}
