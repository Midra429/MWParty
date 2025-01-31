import type { ContentfulStatusCode } from 'hono/utils/http-status'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import type { HonoEnv } from '@/types/env'
import type { ClerkUserPublic } from '@/types/clerk'
import type { Tables } from '@/types/supabase'

import { Hono } from 'hono'

import { uid } from '@/utils/uid'
import { isRoomId } from '@/utils/isRoomId'
import { publicRoomsUpdateSchemaSchema } from '@/schemas/supabase'

import { HTTP_EXCEPTIONS } from '@/constants/http-exception'

export type RoomDetail = Tables<'rooms'> & {
  user: ClerkUserPublic
}

const apiRoom = new Hono<HonoEnv>()

// 取得
apiRoom.post('/detail', async (ctx) => {
  const { clerkAuth, clerk, supabase } = ctx.var

  // 未認証
  if (!clerkAuth?.userId) {
    throw HTTP_EXCEPTIONS.UNAUTHORIZED
  }

  let roomId: string | undefined

  try {
    roomId = (await ctx.req.json()).id
  } catch {}

  let result: PostgrestSingleResponse<Tables<'rooms'>>

  if (roomId) {
    if (!isRoomId(roomId)) {
      return ctx.json(null, {
        status: 400,
        statusText: '部屋IDの形式が無効です',
      })
    }

    result = await supabase.from('rooms').select().eq('id', roomId).single()
  } else {
    result = await supabase
      .from('rooms')
      .select()
      .eq('user_id', clerkAuth.userId)
      .single()
  }

  let detail: RoomDetail | null = null

  if (result.data) {
    const clerkUser = await clerk.users.getUser(result.data.user_id)

    const user: ClerkUserPublic = {
      id: result.data.user_id,
      username: clerkUser.username!,
      name: clerkUser.firstName || null,
      imageUrl: clerkUser.imageUrl,
    }

    detail = { ...result.data, user }
  }

  return ctx.json(detail, {
    status: result.status as ContentfulStatusCode,
    statusText: result.statusText,
  })
})

// 作成
apiRoom.post('/create', async (ctx) => {
  const { clerkAuth, supabase } = ctx.var

  // 未認証
  if (!clerkAuth?.userId) {
    throw HTTP_EXCEPTIONS.UNAUTHORIZED
  }

  // UPSERT
  const result = await supabase
    .from('rooms')
    .upsert(
      {
        id: uid(16),
        user_id: clerkAuth.userId,
      },
      {
        onConflict: 'user_id',
      }
    )
    .eq('is_open', false)
    .select()
    .single()

  return ctx.json(result.data, {
    status: result.status as ContentfulStatusCode,
    statusText: result.statusText,
  })
})

// 更新
apiRoom.post('/update', async (ctx) => {
  const { clerkAuth, supabase } = ctx.var

  // 未認証
  if (!clerkAuth?.userId) {
    throw HTTP_EXCEPTIONS.UNAUTHORIZED
  }

  try {
    const body = await ctx.req.json()
    const data = publicRoomsUpdateSchemaSchema.parse(body)

    delete data.id
    delete data.user_id
    delete data.created_at
    delete data.updated_at

    // UPDATE
    const result = await supabase
      .from('rooms')
      .update(data)
      .eq('user_id', clerkAuth.userId)
      .select()
      .single()

    return ctx.json(result.data, {
      status: result.status as ContentfulStatusCode,
      statusText: result.statusText,
    })
  } catch {
    throw HTTP_EXCEPTIONS.INVALID_PARAMS
  }
})

// 削除
apiRoom.post('/delete', async (ctx) => {
  const { clerkAuth, supabase } = ctx.var

  // 未認証
  if (!clerkAuth?.userId) {
    throw HTTP_EXCEPTIONS.UNAUTHORIZED
  }

  // DELETE
  const result = await supabase
    .from('rooms')
    .delete()
    .eq('user_id', clerkAuth.userId)
    .select()
    .single()

  return ctx.json(result.data, {
    status: result.status as ContentfulStatusCode,
    statusText: result.statusText,
  })
})

export default apiRoom
