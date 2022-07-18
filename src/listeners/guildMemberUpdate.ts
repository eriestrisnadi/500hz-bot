import { Events, Listener } from '@sapphire/framework'
import type { GuildMember } from 'discord.js'
import { envParseArray } from '../lib/env-parser'

const GUILDS = envParseArray('GUILDS')

export class GuildEvent extends Listener<typeof Events.GuildMemberUpdate> {
  public async run(member: GuildMember) {
    if (!GUILDS.includes(member.guild.id)) return

    // console.log(member)
  }
}
