import { jsxRenderer } from 'hono/jsx-renderer'

import { displayName } from '../../extension/package.json'

export const renderer = jsxRenderer(({ title, description, children }, ctx) => {
  const titleText = `${title ? `${title} | ` : ''}${displayName}`

  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        {description && <meta name="description" content={description} />}
        <meta property="og:title" content={titleText} />
        {description && (
          <meta property="og:description" content={description} />
        )}
        <meta property="og:url" content={ctx.req.url} />
        <meta property="og:site_name" content={displayName} />
        <meta property="og:image" content="https://mwp.midra.me/logo.png" />
        <meta property="og:locale" content="ja_JP" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@Midra429" />

        <title>{titleText}</title>

        <link rel="shortcut icon" href="/favicon.ico" />
      </head>

      <body>{children}</body>
    </html>
  )
})
