import * as cheerio from 'cheerio'

export type MetaKey =
  | 'title'
  | 'description'

  // OGP
  | 'og:title'
  | 'og:type'
  | 'og:image'
  | 'og:url'
  | 'og:audio'
  | 'og:description'
  | 'og:determiner'
  | 'og:locale'
  | 'og:locale:alternate'
  | 'og:site_name'
  | 'og:video'
  | 'og:image:url'
  | 'og:image:secure_url'
  | 'og:image:type'
  | 'og:image:width'
  | 'og:image:height'
  | 'og:image:alt'

  // X / Twitter
  | 'twitter:card'
  | 'twitter:site'
  | 'twitter:creator'

export type MetaData = Partial<Record<MetaKey, string>>

export const getMetaData = async (url: string): Promise<MetaData | null> => {
  try {
    const response = await fetch(url)
    const html = await response.text()

    const $ = cheerio.load(html)

    const data: MetaData = {}

    data.title = $('meta[name="title"]').attr('content') || $('title').text()
    data.description = $('meta[name="description"]').attr('content')

    // OGP
    $('meta[property^="og:"]').each(function () {
      const property = $(this).attr('property')!
      const content = $(this).attr('content')

      if (content) {
        data[property as MetaKey] = content
      }
    })

    // X / Twitter
    $('meta[name^="twitter:"]').each(function () {
      const name = $(this).attr('name')!
      const content = $(this).attr('content')

      if (content) {
        data[name as MetaKey] = content
      }
    })

    return data
  } catch {}

  return null
}
