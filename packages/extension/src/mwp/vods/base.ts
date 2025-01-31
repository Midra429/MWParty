import type { VodKey } from '@/types/constants'

export type MwpVodBase = Readonly<{
  key: VodKey
  name: string
  hostname: string
  matches: string[]
  selectors: {
    video: 'video'
    playButton?: 'button'
  }
}>

export const mwpVodBases: Record<VodKey, MwpVodBase> = {
  primeVideo: {
    key: 'primeVideo',
    name: 'Prime Video',
    hostname: 'www.amazon.co.jp',
    get matches() {
      return [`https://${this.hostname}/*`]
    },
    selectors: {
      video: '.webPlayerSDKContainer video[src]' as any,
    },
  },

  dAnime: {
    key: 'dAnime',
    name: 'dアニメストア',
    hostname: 'animestore.docomo.ne.jp',
    get matches() {
      return [`*://${this.hostname}/animestore/*`]
    },
    selectors: {
      video: 'video#video' as any,
      playButton: 'button.playButton' as any,
    },
  },

  abema: {
    key: 'abema',
    name: 'ABEMA',
    hostname: 'abema.tv',
    get matches() {
      return [`https://${this.hostname}/*`]
    },
    selectors: {
      video: '.com-a-Video__video > video[preload][src]' as any,
      playButton: 'button.com-vod-PlaybackButton' as any,
    },
  },

  dmmTv: {
    key: 'dmmTv',
    name: 'DMM TV',
    hostname: 'tv.dmm.com',
    get matches() {
      return [`https://${this.hostname}/*`]
    },
    selectors: {
      video: '#vodWrapper > div > video' as any,
      playButton: 'button:has(> div:is([name="play"], [name="pause"]))' as any,
    },
  },

  hulu: {
    key: 'hulu',
    name: 'Hulu',
    hostname: 'www.hulu.jp',
    get matches() {
      return [`https://${this.hostname}/*`]
    },
    selectors: {
      video:
        '.hulu-player .video-js:not(.vjs-waiting) > video.vjs-tech[src]' as any,
    },
  },

  unext: {
    key: 'unext',
    name: 'U-NEXT',
    hostname: 'video.unext.jp',
    get matches() {
      return [`https://${this.hostname}/*`]
    },
    selectors: {
      video:
        ':is(#videoTagWrapper, div[data-ucn="fullscreenContextWrapper"]) video' as any,
    },
  },

  youtube: {
    key: 'youtube',
    name: 'YouTube',
    hostname: 'www.youtube.com',
    get matches() {
      return [`https://${this.hostname}/*`]
    },
    selectors: {
      video: '.html5-video-player:not(.ad-showing) .html5-main-video' as any,
    },
  },

  niconico: {
    key: 'niconico',
    name: 'ニコニコ動画',
    hostname: 'www.nicovideo.jp',
    get matches() {
      return [`https://${this.hostname}/watch/*`]
    },
    selectors: {
      video:
        'div[data-name="content"] > video[data-name="video-content"]' as any,
    },
  },

  tver: {
    key: 'tver',
    name: 'TVer',
    hostname: 'tver.jp',
    get matches() {
      return [`https://${this.hostname}/*`]
    },
    selectors: {
      video:
        'div[class^="vod-player_videoContainer"] .video-js > video.vjs-tech' as any,
    },
  },
}
