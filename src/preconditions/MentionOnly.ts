import { Precondition } from '@sapphire/framework'
import type { Message } from 'discord.js'

export class UserPrecondition extends Precondition {
  public async run(message: Message) {
    if (!message.mentions.users.first()) return this.error({ message: 'You need mention a user first.' })

    return this.ok()
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    MentionOnly: never
  }
}
