import { Events, Listener } from '@sapphire/framework'
import type { GuildMember } from 'discord.js'
import { envParseArray } from '../lib/env-parser'
import { assignRoles, removeRoles } from '../lib/utils'

const GUILDS = envParseArray('GUILDS')
const VERIFIED_ROLE_NAMES = envParseArray('VERIFIED_ROLE_NAMES')
const UNVERIFIED_ROLE_NAMES = envParseArray('UNVERIFIED_ROLE_NAMES')

export class GuildEvent extends Listener<typeof Events.GuildMemberAdd> {
  public async run(member: GuildMember) {
    if (!GUILDS.includes(member.guild.id)) return

    await assignRoles(member, UNVERIFIED_ROLE_NAMES)
    await removeRoles(member, VERIFIED_ROLE_NAMES)
  }
}
