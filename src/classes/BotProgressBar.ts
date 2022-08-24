import {
  DefaultProgressBarOptions as BaseProgressBarOptions,
  DMPError,
  DMPErrors,
  ProgressBarOptions,
  Utils,
} from 'discord-music-player'
import type { BotQueue } from './BotQueue'

const DefaultProgressBarOptions = {
  ...BaseProgressBarOptions,
  block: '-',
  arrow: '=',
}

export class BotProgressBar {
  private queue: BotQueue
  options: ProgressBarOptions = DefaultProgressBarOptions
  current!: number
  total!: number
  times!: string
  progress!: number
  emptyProgress!: number
  bar!: string

  /**
   * ProgressBar constructor
   * @param {BotQueue} queue
   * @param {ProgressBarOptions} [options=DefaultProgressBarOptions]
   */
  constructor(queue: BotQueue, options: ProgressBarOptions = DefaultProgressBarOptions) {
    /**
     * Guild instance
     * @name ProgressBar#guild
     * @type {Guild}
     * @private
     */

    /**
     * ProgressBar options
     * @name ProgressBar#options
     * @type {PlayerOptions}
     */

    /**
     * Progress Bar without timecodes
     * @name ProgressBar#bar
     * @type {string}
     */

    /**
     * Progress Bar timecodes
     * @name ProgressBar#times
     * @type {string}
     */

    if (queue.destroyed) throw new DMPError(DMPErrors.QUEUE_DESTROYED)
    if (!queue.connection) throw new DMPError(DMPErrors.NO_VOICE_CONNECTION)
    if (!queue.isPlaying) throw new DMPError(DMPErrors.NOTHING_PLAYING)

    this.queue = queue

    this.options = Object.assign({} as ProgressBarOptions, this.options, options)

    this.create()
  }

  /**
   * Creates the Progress Bar
   * @private
   */
  private create() {
    const { size } = this.options
    this.current = this.queue.nowPlaying!.seekTime + this.queue.connection!.time
    this.total = this.queue.nowPlaying!.milliseconds
    this.times = `${Utils.msToTime(this.current)}/${this.queue.nowPlaying!.duration}`
    this.progress = Math.round(size! * (this.current / this.total))
    this.emptyProgress = size! - this.progress

    this.filled()
  }

  split() {
    const { size, block, arrow } = this.options

    if (this.current > this.total) {
      this.bar = block!.repeat(size! + 2)
      return
    }

    const progressText = block!.repeat(this.progress).replace(/.$/, arrow!)
    const emptyProgressText = block!.repeat(this.emptyProgress)

    this.bar = progressText + emptyProgressText
  }

  filled() {
    const { size, block, arrow } = this.options

    if (this.current > this.total) {
      this.bar = block!.repeat(size! + 2)
      return
    }

    const progressText = arrow!.repeat(this.progress)
    const emptyProgressText = block!.repeat(this.emptyProgress)

    this.bar = progressText + emptyProgressText
  }

  /**
   * Progress Bar in a prettier representation
   * @type {string}
   */
  get prettier(): string {
    return `[${this.bar}][${this.times}]`
  }

  /**
   * Progress Bar in string representation
   * @returns {string}
   */
  toString(): string {
    return this.options.time ? this.prettier : `[${this.bar}]`
  }
}
