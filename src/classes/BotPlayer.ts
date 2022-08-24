import { DMPError, DMPErrors, Player, PlayerOptions } from 'discord-music-player'
import type { Client, Collection, Snowflake } from 'discord.js'
import { BotQueue } from './BotQueue'

export class BotPlayer<OptionsData = any> extends Player<OptionsData> {
  /**
   * Player constructor
   * @param {Client} client
   * @param {PlayerOptions} [options={}]
   */
  public constructor(client: Client, options: PlayerOptions = {}) {
    // We call super our options
    super(client, options)
  }

  /**
   * Creates the guild queue.
   * @param {Snowflake} guildId
   * @param {PlayerOptions} [options=this.options]
   * @returns {BotQueue}
   */
  public override createQueue<D extends OptionsData>(
    guildId: Snowflake,
    options: PlayerOptions & { data?: D } = this.options
  ): BotQueue<D> {
    options = Object.assign({} as PlayerOptions, this.options, options)

    const guild = this.client.guilds.resolve(guildId)
    if (!guild) throw new DMPError(DMPErrors.INVALID_GUILD)
    if (this.hasQueue(guildId) && !this.getQueue(guildId)?.destroyed) return this.getQueue(guildId) as BotQueue<D>

    const { data } = options
    delete options.data
    const queue = new BotQueue<D>(this, guild, options)
    queue.data = data
    this.setQueue(guildId, queue)

    return queue as BotQueue<D>
  }

  /**
   * Gets the guild queue.
   * @param {Snowflake} guildId
   * @returns {?BotQueue}
   */
  public override getQueue(guildId: Snowflake): BotQueue | undefined {
    return (this.queues as Collection<Snowflake, BotQueue<OptionsData>>).get(guildId)
  }
}
