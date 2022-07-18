import type { CommandDeniedPayload, ListenerOptions, PieceContext } from '@sapphire/framework'
import { Events, Listener, UserError } from '@sapphire/framework'

export class UserEvent extends Listener<typeof Events.CommandDenied> {
  public constructor(context: PieceContext, options?: ListenerOptions) {
    super(context, {
      ...options,
      event: Events.CommandDenied,
    })
  }
  public async run({ context, message: content }: UserError, { message }: CommandDeniedPayload) {
    // `context: { silent: true }` should make UserError silent:
    if (Reflect.get(Object(context), 'silent')) return

    await message.react('👎')

    return message.channel.send({ content, allowedMentions: { users: [message.author.id], roles: [] } })
  }
}
