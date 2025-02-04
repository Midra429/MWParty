import type { VodKey } from '@/types/constants'
import type { MwpVodBase } from './base'

import { normalizeAll } from '@midra/nco-parser/normalize'
import { ncoApiProxy } from '@/proxy/ncoApi/extension'

import { mwpVodBases } from './base'

export type MwpVod = Readonly<
  MwpVodBase & {
    getId: () => string | null
    getTitle: () => Promise<string | null>
    createUrl: (id: string) => string
    createSearchUrl: (keyword: string) => string
  }
>

export const mwpVods: Record<VodKey, MwpVod> = {
  primeVideo: {
    ...mwpVodBases.primeVideo,
    getId() {
      const canonical = document.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]'
      )
      const url = canonical?.href ?? location.href

      const matched1 = url.match(
        /\/(?:dp|video\/detail)\/(?<id>[A-Z0-9]+)(?:\/|$)/
      )
      const id1 = matched1?.groups?.id

      const id2 = document.querySelector<HTMLInputElement>(
        '.dv-dp-node-watchlist input[name="titleID"]'
      )?.value

      return id1 || id2 || null
    },
    async getTitle() {
      const titleElem = document.querySelector<HTMLElement>(
        '.webPlayerSDKContainer .atvwebplayersdk-title-text'
      )
      const subtitleElem = document.querySelector<HTMLElement>(
        '.webPlayerSDKContainer .atvwebplayersdk-subtitle-text'
      )

      const workTitle = titleElem?.textContent
      const episodeTitle = subtitleElem?.textContent

      const title = [workTitle, episodeTitle].filter(Boolean).join(' ').trim()

      return title || null
    },
    createUrl(id) {
      const url = new URL(`https://${this.hostname}/gp/video/detail/${id}`)

      url.searchParams.set('autoplay', '1')
      url.searchParams.set('t', '0')

      return url.href
    },
    createSearchUrl(keyword) {
      const url = new URL(`https://${this.hostname}/s`)

      url.searchParams.set('k', keyword)
      url.searchParams.set('i', 'instant-video')
      url.searchParams.set('dc', '')

      return url.href
    },
  },

  dAnime: {
    ...mwpVodBases.dAnime,
    getId() {
      const url = new URL(location.href)

      return url.searchParams.get('partId')
    },
    async getTitle() {
      const partId = this.getId()

      if (!partId) {
        return null
      }

      const partData = await ncoApiProxy.danime.part(partId)

      return partData?.title ?? null
    },
    createUrl(id) {
      const url = new URL(`https://${this.hostname}/animestore/sc_d_pc`)

      url.searchParams.set('partId', id)

      return url.href
    },
    createSearchUrl(keyword) {
      const url = new URL(`https://${this.hostname}/animestore/sch_pc`)

      url.searchParams.set('searchKey', keyword)

      return url.href
    },
  },

  abema: {
    ...mwpVodBases.abema,
    getId() {
      const url = new URL(location.href)

      const matched = url.pathname.match(
        /^\/video\/episode\/(?<id>[a-z0-9_\-]+)/
      )

      return matched?.groups?.id || null
    },
    async getTitle() {
      const programId = this.getId()
      const token = localStorage.getItem('abm_token')

      if (!programId || !token) {
        return null
      }

      const program = await ncoApiProxy.abema.v1.video.programs(
        programId,
        token
      )

      if (!program) {
        return null
      }

      const seriesTitle = program.series.title

      let workTitle = seriesTitle

      if (program.season && 1 < program.season.sequence) {
        const normalizedSeasonName = normalizeAll(program.season.name)
        const normalizedSeriesTitle = normalizeAll(seriesTitle)

        if (normalizedSeasonName.includes(normalizedSeriesTitle)) {
          workTitle = program.season.name
        } else {
          workTitle = `${seriesTitle} ${program.season.name}`
        }
      }

      const episodeTitle = program.episode.title

      const title = [workTitle, episodeTitle].filter(Boolean).join(' ').trim()

      return title || null
    },
    createUrl(id) {
      return `https://${this.hostname}/video/episode/${id}`
    },
    createSearchUrl(keyword) {
      const url = new URL(`https://${this.hostname}/search`)

      url.searchParams.set('q', keyword)

      return url.href
    },
  },

  dmmTv: {
    ...mwpVodBases.dmmTv,
    getId() {
      const url = new URL(location.href)

      const season = url.searchParams.get('season')
      const content = url.searchParams.get('content')

      if (season && content) {
        return `season=${season}&content=${content}`
      }

      return null
    },
    async getTitle() {
      const url = new URL(location.href)

      const seasonId = url.searchParams.get('season')
      const contentId = url.searchParams.get('content')

      if (!seasonId || !contentId) {
        return null
      }

      const dataVideo = await ncoApiProxy.dmmTv.video({ seasonId, contentId })

      if (!dataVideo) {
        return null
      }

      const workTitle = dataVideo.seasonName.includes(dataVideo.titleName)
        ? dataVideo.seasonName
        : [dataVideo.titleName, dataVideo.seasonName]
            .filter(Boolean)
            .join(' ')
            .trim()

      const episodeTitle = [
        dataVideo.episode?.episodeNumberName,
        dataVideo.episode?.episodeTitle,
      ]
        .filter(Boolean)
        .join(' ')
        .trim()

      const title = [workTitle, episodeTitle].filter(Boolean).join(' ').trim()

      return title || null
    },
    createUrl(id) {
      const url = new URL(`https://${this.hostname}/vod/playback/`)

      url.search = id

      return url.href
    },
    createSearchUrl(keyword) {
      const url = new URL(`https://${this.hostname}/vod/list/`)

      url.searchParams.set('keyword', keyword)

      return url.href
    },
  },

  hulu: {
    ...mwpVodBases.hulu,
    getId() {
      const url = new URL(location.href)

      const matched = url.pathname.match(/^\/watch\/(?<id>\d+)/)

      return matched?.groups?.id || null
    },
    async getTitle() {
      const titleElem = document.querySelector<HTMLElement>(
        '.watch-info-title > .title > a'
      )
      const episodeElem = document.querySelector<HTMLElement>(
        '.watch-info-title > .title > .ep_no'
      )
      const subTitleElem = document.querySelector(
        '.watch-info-title > .playable-title'
      )

      const workTitle = titleElem?.textContent
      const episodeTitle = [episodeElem?.textContent, subTitleElem?.textContent]
        .filter(Boolean)
        .join(' ')
        .trim()

      const title = [workTitle, episodeTitle].filter(Boolean).join(' ').trim()

      return title || null
    },
    createUrl(id) {
      return `https://${this.hostname}/watch/${id}`
    },
    createSearchUrl(keyword) {
      const url = new URL(`https://${this.hostname}/search`)

      url.searchParams.set('q', keyword)

      return url.href
    },
  },

  unext: {
    ...mwpVodBases.unext,
    getId() {
      const url = new URL(location.href)

      const matched = url.pathname.match(/^\/play\/(?<id>SID\d+\/ED\d+)/)

      return matched?.groups?.id || null
    },
    async getTitle() {
      const sid_ed = this.getId()

      if (!sid_ed) {
        return null
      }

      const [id, episodeCode] = sid_ed.split('/')

      const titleStage = await ncoApiProxy.unext.title({
        id,
        episodeCode,
      })

      if (!titleStage?.episode) {
        return null
      }

      const workTitle = titleStage.titleName
      const episodeTitle = [
        titleStage.episode.displayNo,
        titleStage.episode.episodeName,
      ].join(' ')

      const title = [workTitle, episodeTitle].filter(Boolean).join(' ').trim()

      return title || null
    },
    createUrl(id) {
      return `https://${this.hostname}/play/${id}`
    },
    createSearchUrl(keyword) {
      const url = new URL(`https://${this.hostname}/freeword`)

      url.searchParams.set('query', keyword)

      return url.href
    },
  },

  youtube: {
    ...mwpVodBases.youtube,
    getId() {
      const url = new URL(location.href)

      return url.searchParams.get('v')
    },
    async getTitle() {
      return document.querySelector('a.ytp-title-link')?.textContent ?? null
    },
    createUrl(id) {
      const url = new URL(`https://${this.hostname}/watch`)

      url.searchParams.set('v', id)

      return url.href
    },
    createSearchUrl(keyword) {
      const url = new URL(`https://${this.hostname}/results`)

      url.searchParams.set('search_query', keyword)

      return url.href
    },
  },

  niconico: {
    ...mwpVodBases.niconico,
    getId() {
      const url = new URL(location.href)

      const matched = url.pathname.match(/^\/watch\/(?<id>[a-z]{2}?\d+)/)

      return matched?.groups?.id || null
    },
    async getTitle() {
      const id = this.getId()

      if (!id) {
        return null
      }

      const videoData = await ncoApiProxy.niconico.video(id)

      return videoData?.video.title ?? null
    },
    createUrl(id) {
      return `https://${this.hostname}/watch/${id}`
    },
    createSearchUrl(keyword) {
      return `https://${this.hostname}/search/${encodeURIComponent(keyword)}`
    },
  },

  tver: {
    ...mwpVodBases.tver,
    getId() {
      const url = new URL(location.href)

      const matched = url.pathname.match(/^\/episodes\/(?<id>[a-z0-9]+)/)

      return matched?.groups?.id || null
    },
    async getTitle() {
      const seriesTitleElem = document.querySelector<HTMLElement>(
        'h2[class^="titles_seriesTitle"]'
      )
      const titleElem = document.querySelector<HTMLElement>(
        'h1[class^="titles_title"]'
      )

      const workTitle = seriesTitleElem?.textContent
      const episodeTitle = titleElem?.textContent

      const title = [workTitle, episodeTitle].filter(Boolean).join(' ').trim()

      return title || null
    },
    createUrl(id) {
      return `https://${this.hostname}/episodes/${id}`
    },
    createSearchUrl(keyword) {
      return `https://${this.hostname}/search/${encodeURIComponent(keyword)}`
    },
  },
}
