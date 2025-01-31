import type { HonoEnv } from '@/types/env'

import { Hono } from 'hono'

import { isRoomId } from '@/utils/validate'

const routeRoom = new Hono<HonoEnv>()

routeRoom.get('/:id', async (ctx) => {
  const id = ctx.req.param('id')

  if (!isRoomId(id)) {
    return ctx.text('部屋IDの形式が無効です', 400)
  }

  return ctx.render(<div id="root" />, {
    title: '部屋に参加',
    description: 'このリンクから部屋に参加できます。',
  })
})

export default routeRoom
