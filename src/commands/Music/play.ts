import { ApplyOptions } from '@sapphire/decorators'
import type { Args } from '@sapphire/framework'
import BotCommand, { CustomCommandOptions } from '../../classes/BotCommand'
import { Guild, Message, MessageEmbed, VoiceBasedChannel } from 'discord.js'
import { send } from '@sapphire/plugin-editable-commands'
import { Playlist, Song, Utils } from 'discord-music-player'

@ApplyOptions<CustomCommandOptions>({
  name: 'play',
  description: 'Plays audio.',
  fullCategory: ['Music'],
  aliases: ['pl', 'p'],
  detailedDescription: 'A command that plays a user-requested.',
})
export class UserCommand extends BotCommand {
  public async messageRun(message: Message, args: Args) {
    if (!args) {
      return await send(message, {
        embeds: [
          new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Urgh')
            .setDescription('How do you think I can find something with no link or search term? Reading your mind?!'),
        ],
      })
    }

    if (!message.member || !message.guild) return

    if (!message.member.voice.channel) {
      return await send(message, {
        embeds: [
          new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Urgh')
            .setDescription('You need to be in a voice channel to use this, duh'),
        ],
      })
    }

    const songOrPlaylist = await this.findAndPlay(
      message.guild,
      message.member.voice.channel,
      await args.rest('string').catch(() => '')
    )

    return songOrPlaylist ? await this.printSongInfo(songOrPlaylist, message) : undefined
  }

  private async findAndPlay(guild: Guild, channel: VoiceBasedChannel, songName: string) {
    const guildQueue = this.container.player.getQueue(guild.id)
    const queue = this.container.player.createQueue(guild.id)
    await queue.join(channel)
    const songOrPlaylist = await queue
      .play(songName)
      .catch(() => queue.playlist(songName))
      .catch((err) => {
        /* tslint:disable */
        console.error(err)
        /* tslint:enable */

        if (!guildQueue) queue.stop()

        return undefined
      })

    return songOrPlaylist
  }

  private async printSongInfo(songOrPlaylist: Song | Playlist, message: Message) {
    const song = songOrPlaylist instanceof Playlist ? this.playlistToSong(songOrPlaylist) : songOrPlaylist

    const botMessage = await send(message, {
      embeds: [
        new MessageEmbed()
          .setColor('#FF00FF')
          .setTitle('Song added to queue!')
          .setDescription(`**Title:** ${song.name}\n**Length:** ${song.duration}\n**Channel:** ${song.author}`)
          .setImage(song.thumbnail),
      ],
    })

    setTimeout(() => botMessage.delete(), 30 * 1000)

    return botMessage
  }

  private playlistToSong(playlist: Playlist) {
    return new Song(
      {
        name: playlist.name,
        author: playlist.author,
        url: playlist.url,
        thumbnail: playlist.songs.length ? playlist.songs[0].thumbnail : '',
        duration: this.createPlaylistDuration(playlist),
        isLive: false,
      },
      playlist.queue
    )
  }

  private createPlaylistDuration(playlist: Playlist) {
    return playlist.songs.length
      ? Utils.msToTime(
          playlist.songs.reduce((acc, curr) => {
            return acc + Utils.timeToMs(curr.duration)
          }, 0)
        )
      : ''
  }
}
