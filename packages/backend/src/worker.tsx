import type { HonoEnv } from '@/types/env'

import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { clerkMiddleware } from '@hono/clerk-auth'

import { renderer } from '@/renderer'
import { supabaseMiddleware } from '@/middleware/supabase'

import routeApi from '@/routes/api'
import routeRoom from '@/routes/room'

const worker = new Hono<HonoEnv>({
  strict: false,
})

worker.use(renderer, clerkMiddleware(), supabaseMiddleware())

worker.onError((err, ctx) => {
  if (err instanceof HTTPException) {
    return err.getResponse()
  }

  return ctx.text(err.message, 500)
})

worker.get('/', (ctx) => {
  return ctx.render(<div id="root" />)
})

worker.get('/manual', (ctx) => {
  return ctx.render(<div id="root" />)
})

worker.get('/redirect/*', (ctx) => {
  return ctx.render(
    <>
      <p>拡張機能へリダイレクト中...</p>
      <p>
        しばらく経ってもページが切り替わらない場合は、タブを閉じてください。
      </p>
    </>
  )
})

worker.route('/api', routeApi)
worker.route('/room', routeRoom)

export default worker
