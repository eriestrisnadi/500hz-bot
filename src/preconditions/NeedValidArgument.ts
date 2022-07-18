import { Args, Command, CommandOptions, Precondition } from '@sapphire/framework'
import type { Message } from 'discord.js'
import { createArgsFromPrecondition } from '../lib/utils'

export class UserPrecondition extends Precondition {
  public async run(message: Message, command: Command<Args, CommandOptions>, context: any) {
    const args = createArgsFromPrecondition(message, command, context)
    await args.repeat('member')

    const next = args.finished ? null : args.rest('string')

    if (!next) return this.error({ message: 'Need at least one valid argument.' })

    return this.ok()
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    NeedValidArgument: never
  }
}
