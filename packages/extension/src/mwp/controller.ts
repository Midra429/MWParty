import type { Runtime } from 'wxt/browser'
import type { PlaybackVod } from 'backend/schemas/message'
import type { SettingsItems } from '@/types/storage'
import type {
  PortMessageToContent,
  PortMessageToBackground,
} from '@/entrypoints/background/connection'
import type { MwpVod } from './vods'

import { SETTINGS_MAX_LATENCY_SEC } from '@/constants/settings/default'

import { logger } from '@/utils/logger'
import { webext } from '@/utils/webext'
import { settings } from '@/utils/settings/extension'
import { sendUtilsMessage } from '@/utils/extension/messaging'

import { onMwpMessage } from './messaging'
import { mwpState } from './state'

const TITLE_PREFIX = '🎉 '

const updateTitle = () => {
  if (!document.title.startsWith(TITLE_PREFIX)) {
    document.title = TITLE_PREFIX + document.title
  }
}
const resetTitle = () => {
  document.title = document.title.replace(new RegExp(`^${TITLE_PREFIX}`), '')
}

export class MwpController {
  #vod: MwpVod

  #active: boolean = false
  #disposed: boolean = true

  #video: HTMLVideoElement | null = null
  #port: Runtime.Port | null = null

  #maxLatency: SettingsItems['settings:maxLatency'] = 'medium'
  #useMaxLatency: boolean = false
  #intervalId: NodeJS.Timeout | null = null

  #callbacks: {
    onDispose: Function[]
    onDeactivate: Function[]
  } = {
    onDispose: [],
    onDeactivate: [],
  }

  #videoListeners = {
    handleEvent(evt) {
      // @ts-ignore
      this[evt.type]?.(evt)
    },

    // host
    loadedmetadata: () => {
      this.updatePlayback()
    },
    // guest
    loadeddata: async () => {
      if (!this.#video) return

      const playback = await mwpState.get('playback')

      if (playback?.state === 'play') {
        this.play()
      } else {
        this.pause()
      }

      this.#video.currentTime = playback?.time ?? 0

      setTimeout(() => {
        this.#useMaxLatency = true
      }, 6000)
    },
    // host
    playing: () => {
      if (!this.#video) return

      this.postMessage({
        type: 'play',
        time: this.#video.currentTime,
      })
    },
    // host
    pause: () => {
      if (!this.#video) return

      this.postMessage({
        type: 'pause',
        time: this.#video.currentTime,
      })
    },
    // host
    seeked: () => {
      if (!this.#video) return

      this.postMessage({
        type: 'seek',
        time: this.#video.currentTime,
      })
    },
  } satisfies EventListenerObject & {
    [type in keyof HTMLVideoElementEventMap]?: (
      evt: HTMLVideoElementEventMap[type]
    ) => void
  }

  #portListeners = {
    onMessage: (message: unknown, port: Runtime.Port) => {
      const msg = message as PortMessageToContent

      switch (msg.type) {
        case 'ping': {
          this.postMessage({ type: 'pong' })

          break
        }
      }
    },
  }

  get active() {
    return this.#active
  }
  get disposed() {
    return this.#disposed
  }
  get video() {
    return this.#video
  }

  constructor(vod: MwpVod) {
    this.#vod = vod
  }

  async initialize(video: HTMLVideoElement) {
    logger.log('MwpController.initialize()')

    this.dispose()

    this.#disposed = false

    this.#video = video

    this.#callbacks.onDispose.push(
      onMwpMessage('content:activate', () => this.activate()),
      onMwpMessage('content:deactivate', () => this.deactivate()),
      onMwpMessage('content:getVodDetail', () => this.getVodDetail())
    )

    const currentTab = await sendUtilsMessage('getCurrentTab', null)
    const tabId = await mwpState.get('tabId')

    if (currentTab?.id === tabId) {
      const mode = await mwpState.get('mode')

      let activate = false

      if (mode === 'host') {
        activate = true
      } else {
        const manual = await mwpState.get('manual')

        if (manual) {
          activate = true
        } else {
          const playback = await mwpState.get('playback')
          const vodDetail = await this.getVodDetail()

          const isSamePlaybackVod = playback?.vods.some(
            (vod) => vod.key === vodDetail?.key && vod.id === vodDetail.id
          )

          if (isSamePlaybackVod) {
            activate = true
          }
        }
      }

      if (activate) {
        await this.activate()
      }
    }
  }

  dispose() {
    if (!this.#disposed) {
      logger.log('MwpController.dispose()')
    }

    this.#disposed = true

    while (this.#callbacks.onDispose.length) {
      this.#callbacks.onDispose.pop()?.()
    }

    this.deactivate()

    this.#video = null
  }

  async activate() {
    if (!this.#video) {
      return false
    }

    logger.log('MwpController.activate()')

    this.deactivate()

    this.#active = true

    this.#video.classList.add('mwp-video')

    const mode = await mwpState.get('mode')

    // ホスト (再生状況をバックグラウンドに送信)
    if (mode === 'host') {
      const sendTime = () => {
        if (this.#video) {
          this.postMessage({
            type: 'time',
            time: this.#video.currentTime,
          })
        }

        this.#intervalId = setTimeout(
          sendTime,
          this.#video && !this.#video.paused ? 3000 : 6000
        )
      }

      sendTime()

      // メタデータ読み込み済み
      if (HTMLMediaElement.HAVE_METADATA <= this.#video.readyState) {
        setTimeout(() => {
          this.#videoListeners.handleEvent(new Event('loadedmetadata'))
        }, 100)
      }

      this.#video.addEventListener('loadedmetadata', this.#videoListeners)
      this.#video.addEventListener('playing', this.#videoListeners)
      this.#video.addEventListener('pause', this.#videoListeners)
      this.#video.addEventListener('seeked', this.#videoListeners)
    }
    // ゲスト (再生状況を監視・反映)
    else {
      this.#useMaxLatency = false

      this.#callbacks.onDeactivate.push(
        settings.watch('settings:maxLatency', (maxLatency) => {
          this.#maxLatency = maxLatency
        }),

        mwpState.watch('playback', (newPlayback, oldPlayback) => {
          if (!this.#video) return

          if (newPlayback) {
            const { state, time } = newPlayback

            // 再生 / 一時停止
            const isPlaybackStateChanged =
              state === 'play' ? this.play() : this.pause()

            if (isPlaybackStateChanged) {
              this.#video.currentTime = time
            }
            // 再生時間
            else if (time !== oldPlayback?.time) {
              const latencyThreshold =
                SETTINGS_MAX_LATENCY_SEC[
                  this.#useMaxLatency ? this.#maxLatency : 'min'
                ]
              const diff = Math.abs(this.#video.currentTime - time)

              if (latencyThreshold <= diff) {
                this.#video.currentTime = time
              }
            }
          } else {
            this.#video.pause()
          }
        })
      )

      // データ読み込み済み
      if (HTMLMediaElement.HAVE_CURRENT_DATA <= this.#video.readyState) {
        setTimeout(() => {
          this.#videoListeners.handleEvent(new Event('loadeddata'))
        }, 100)
      }

      this.#video.addEventListener('loadeddata', this.#videoListeners)
    }

    // ポート
    this.#port = webext.runtime.connect({
      name: 'content',
    })

    this.#port.onDisconnect.addListener(() => this.dispose())
    this.#port.onMessage.addListener(this.#portListeners.onMessage)

    // タイトル更新
    updateTitle()

    const obsOptions: MutationObserverInit = {
      childList: true,
      subtree: true,
      characterData: true,
    }
    const obs = new MutationObserver(() => {
      obs.disconnect()

      updateTitle()

      obs.observe(document.head, obsOptions)
    })

    obs.observe(document.head, obsOptions)

    this.#callbacks.onDeactivate.push(() => {
      obs.disconnect()

      resetTitle()
    })

    return true
  }

  deactivate() {
    if (this.#active) {
      logger.log('MwpController.deactivate()')
    }

    this.#active = false

    this.#video?.classList.remove('mwp-video')

    while (this.#callbacks.onDeactivate.length) {
      this.#callbacks.onDeactivate.pop()?.()
    }

    if (this.#video) {
      this.#video.removeEventListener('loadedmetadata', this.#videoListeners)
      this.#video.removeEventListener('loadeddata', this.#videoListeners)
      this.#video.removeEventListener('playing', this.#videoListeners)
      this.#video.removeEventListener('pause', this.#videoListeners)
      this.#video.removeEventListener('seeked', this.#videoListeners)
    }

    if (this.#port) {
      this.#port.onMessage.removeListener(this.#portListeners.onMessage)

      this.#port.disconnect()

      this.#port = null
    }

    if (this.#intervalId !== null) {
      clearTimeout(this.#intervalId)

      this.#intervalId = null
    }

    return true
  }

  postMessage(message: PortMessageToBackground) {
    this.#port?.postMessage(message)
  }

  async getVodDetail(): Promise<PlaybackVod | undefined> {
    const key = this.#vod.key
    const id = this.#vod.getId()
    const title = await this.#vod.getTitle()

    if (id) {
      return {
        key,
        id,
        title: title ?? '',
      }
    }
  }

  async updatePlayback() {
    if (!this.#video) return

    logger.log('MwpController.updatePlayback()')

    const vodDetail = await this.getVodDetail()

    logger.log('vodDetail', vodDetail)

    if (vodDetail) {
      this.postMessage({
        type: 'vod',
        ...vodDetail,
      })
    }

    this.postMessage({
      type: this.#video.paused ? 'pause' : 'play',
      time: this.#video.currentTime,
    })
  }

  play() {
    if (this.#video?.paused === true) {
      const playButtonSelector = this.#vod.selectors.playButton

      if (playButtonSelector) {
        document.querySelector(playButtonSelector)?.click()
      } else {
        this.#video.play()
      }

      return true
    }

    return false
  }

  pause() {
    if (this.#video?.paused === false) {
      const playButtonSelector = this.#vod.selectors.playButton

      if (playButtonSelector) {
        document.querySelector(playButtonSelector)?.click()
      } else {
        this.#video.pause()
      }

      return true
    }

    return false
  }
}
