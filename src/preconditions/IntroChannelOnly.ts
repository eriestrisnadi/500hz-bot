import { Precondition } from '@sapphire/framework'
import type { Message, TextChannel } from 'discord.js'
import { envParseArray } from '../lib/env-parser'

const INTRODUCTION_CHANNEL_NAMES = envParseArray('INTRODUCTION_CHANNEL_NAMES')

export class UserPrecondition extends Precondition {
  public async run(message: Message) {
    if (
      !INTRODUCTION_CHANNEL_NAMES.map((v) => String(v || '').toLowerCase()).includes(
        (message.channel as TextChannel).name.toLowerCase()
      )
    )
      return this.error({ context: { silent: true } })

    return this.ok()
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    IntroChannelOnly: never
  }
}
