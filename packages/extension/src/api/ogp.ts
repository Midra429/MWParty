import { logger } from '@/utils/logger'
import { webext } from '@/utils/webext'

export type OgpData = {
  url: string
  site_name: string | null
  favicon: string | null
  title: string | null
  description: string | null
  image: string | null
  is_large_image: number | null
  created_at: number
  updated_at: number
}

const extensionId = webext.runtime.id

export const ogpApi = {
  async get(targetUrl: string): Promise<OgpData | null> {
    try {
      const url = new URL(import.meta.env.WXT_OGP_API)

      url.searchParams.set('url', targetUrl)

      const response = await fetch(url, {
        headers: {
          'X-Extension-Id': extensionId,
        },
      })

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`)
      }

      const json: OgpData | null = await response.json()

      return json
    } catch (err) {
      logger.error(err)
    }

    return null
  },
}
