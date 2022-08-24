import play from 'play-dl'
import {
  DefaultPlayOptions,
  DMPError,
  DMPErrors,
  PlayerOptions,
  PlayOptions,
  ProgressBarOptions,
  Queue,
  Song,
  Utils,
} from 'discord-music-player'
import type { Guild } from 'discord.js'
import type { AudioResource } from '@discordjs/voice'
import type { BotPlayer } from './BotPlayer'
import { BotProgressBar } from './BotProgressBar'

export class BotQueue<T = unknown> extends Queue<T> {
  /**
   * Queue constructor
   * @param {BotPlayer} player
   * @param {Guild} guild
   * @param {PlayerOptions} options
   */
  public constructor(player: BotPlayer, guild: Guild, options?: PlayerOptions) {
    // We call super our options
    super(player, guild, options)
  }

  /**
   * Plays or Queues a song (in a VoiceChannel)
   * @param {Song | string} search
   * @param {PlayOptions} [options=DefaultPlayOptions]
   * @returns {Promise<Song>}
   */
  public override async play(
    search: Song | string,
    options: PlayOptions & { immediate?: boolean; seek?: number; data?: any } = DefaultPlayOptions
  ): Promise<Song> {
    if (this.destroyed) throw new DMPError(DMPErrors.QUEUE_DESTROYED)

    if (!this.connection) throw new DMPError(DMPErrors.NO_VOICE_CONNECTION)

    options = Object.assign({} as PlayOptions, DefaultPlayOptions, options)

    const { data } = options

    delete options.data

    let song = await Utils.best(search, options, this).catch((error) => {
      throw new DMPError(error)
    })

    if (!options.immediate) song.data = data

    const songLength = this.songs.length

    if (!options?.immediate && songLength !== 0) {
      if (options?.index! >= 0 && ++options.index! <= songLength) this.songs.splice(options.index!, 0, song)
      else this.songs.push(song)
      this.player.emit('songAdd', this, song)

      return song
    } else if (!options?.immediate) {
      song._setFirst()
      if (options?.index! >= 0 && ++options.index! <= songLength) this.songs.splice(options.index!, 0, song)
      else this.songs.push(song)
      this.player.emit('songAdd', this, song)
    } else if (options.seek) this.songs[0].seekTime = options.seek

    song = this.songs[0]
    if (song.seekTime) options.seek = song.seekTime

    const { stream, type } = await play
      .stream(song.url, {
        discordPlayerCompatibility: true,
        seek: options.seek ? options.seek / 1000 : 0,
      })
      .catch((error: { message: string }) => {
        if (!/Status code|premature close/i.test(error.message))
          this.player.emit('error', error.message === 'Video unavailable' ? 'VideoUnavailable' : error.message, this)
        throw error
      })

    const resource: AudioResource<Song> = this.connection.createAudioStream(stream, {
      metadata: song,
      inputType: type,
    })

    setTimeout(() => {
      this.connection!.playAudioStream(resource).then(() => {
        this.setVolume(this.options.volume!)
      })
    })

    return song
  }

  /**
   * Creates Custom Progress Bar class
   * @param {ProgressBarOptions} [options]
   * @returns {BotProgressBar}
   */
  public customProgressBar(options?: ProgressBarOptions): BotProgressBar {
    if (this.destroyed) throw new DMPError(DMPErrors.QUEUE_DESTROYED)
    if (!this.isPlaying) throw new DMPError(DMPErrors.NOTHING_PLAYING)

    return new BotProgressBar(this, options)
  }
}
