import { fetch, FetchResultTypes } from '@sapphire/fetch'
import { load } from 'cheerio'
import { cleanString, safeObject } from '../utils'

const baseUrl = 'https://www.pointblank.id'

interface Player extends Partial<PlayerDetail> {
  nickname: string
  uid: string
  grade: string
}

interface PlayerDetail {
  rank: string
  exp: string
  kill: string
  headshot: string
  death: string
  clanName: string
  clanMasterNick: string
  clanTroops: string
  clanExpRank: string
  clanTroopsMax?: any
}

export const findNickName = async (nickName: string) => {
  const response = await fetch(
    baseUrl + '/ranking/individual/list?termtype=3&keyword=' + encodeURI(nickName),
    FetchResultTypes.Text
  )

  const $ = load(response)

  const players: Player[] = []

  $('.rank_d, .rank_d').each((_, el) => {
    const uid = cleanString(
      ($(el).find('.pop_on').attr('href') || '').split(',').find((v) => !isNaN(Number(v))) as string
    )
    const nickname = cleanString($(el).find('.nick').text())
    const grade = cleanString($(el).find('.nick').text())

    players.push({ uid, nickname, grade })
  })

  const player = players.pop()

  if (!player) return player

  return safeObject<Player>({ ...player, ...(await getDetailPlayerByUid(player.uid)) })
}

export const getDetailPlayerByUid = async (uid: string | number) => {
  return await fetch<PlayerDetail>(baseUrl + '/ranking/individual/detail?termtype=3&uid=' + uid, FetchResultTypes.JSON)
}
