import type { CommandAcceptedPayload, ListenerOptions, PieceContext } from '@sapphire/framework'
import { Events, Listener } from '@sapphire/framework'

export class UserEvent extends Listener<typeof Events.CommandAccepted> {
  public constructor(context: PieceContext, options?: ListenerOptions) {
    super(context, {
      ...options,
      event: Events.CommandAccepted,
    })
  }

  public async run({ message }: CommandAcceptedPayload) {
    await message.react('👍')
  }
}
