import * as Lexure from 'lexure'
import { Command, Args, CommandOptions, Precondition } from '@sapphire/framework'
import type { GuildMember, Message } from 'discord.js'

export const createArgsFromPrecondition = (
  message: Message,
  command: Command<Args, CommandOptions>,
  context: Precondition.Context
): Args => {
  const parser = new Lexure.Parser(
    (context as any).command.lexer.setInput(context.parameters).lex()
  ).setUnorderedStrategy((context as any).command.strategy)
  const args = new Lexure.Args(parser.parse())

  return new Args(message, command, args, (context as any).context)
}

export const humanizeMs = (ms: number): string => {
  let temp = ms / 1000
  const years = Math.floor(temp / 31536000)
  const days = Math.floor((temp %= 31536000) / 86400)
  const hours = Math.floor((temp %= 86400) / 3600)
  const minutes = Math.floor((temp %= 3600) / 60)
  const seconds = temp % 60

  if (days || hours || seconds || minutes) {
    return (
      (years ? years + 'y ' : '') +
      (days ? days + 'd ' : '') +
      (hours ? hours + 'h ' : '') +
      (minutes ? minutes + 'm ' : '') +
      Number.parseFloat(seconds.toString()).toFixed(2) +
      's'
    )
  }

  return '< 1s'
}

export const cleanString = (str: string) => str.replace(/(\r\n|\n|\r|\t|^\s)/gm, '')

export const escapeCodeBlockMarkdown = (str: string) => str.replace(/`/gm, '\\`')

export const safeObject = <T extends Record<string, any>>(obj: T) =>
  Object.fromEntries(Object.entries(obj).filter(([_, value]) => !!value)) as T

export const assignRoles = async (member: GuildMember, roles: string[]) => {
  await member.guild.roles.fetch()

  for await (const roleName of roles) {
    const role = member.guild.roles.cache.find((r) => r.name.toLowerCase() === String(roleName || '').toLowerCase())

    if (!role) continue

    await member.roles.add(role)
  }
}

export const removeRoles = async (member: GuildMember, roles: string[]) => {
  await member.guild.roles.fetch()

  for await (const roleName of roles) {
    const role = member.guild.roles.cache.find((r) => r.name.toLowerCase() === String(roleName || '').toLowerCase())

    if (!role) continue

    await member.roles.remove(role)
  }
}
