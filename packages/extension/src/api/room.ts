import type { Tables, TablesUpdate } from 'backend/types/supabase'
import type { RoomDetail } from 'backend/routes/api/room'

import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage/extension'
import { getClerkToken } from '@/utils/clerk'

export const roomApi = {
  BASE_URL: `https://${import.meta.env.WXT_PARTYKIT_HOST}/api/room`,

  async detail(
    id?: string | null,
    token?: string | null
  ): Promise<RoomDetail | null> {
    token ??= await getClerkToken()

    if (!token) return null

    try {
      const response = await fetch(`${this.BASE_URL}/detail`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: id && JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`)
      }

      const json: RoomDetail | null = await response.json()

      return json
    } catch (err) {
      logger.error(err)
    }

    return null
  },

  async create(token?: string | null): Promise<Tables<'rooms'> | null> {
    token ??= await getClerkToken()

    if (!token) return null

    try {
      const response = await fetch(`${this.BASE_URL}/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`)
      }

      const json: Tables<'rooms'> | null = await response.json()

      return json
    } catch (err) {
      logger.error(err)
    }

    return null
  },

  async update(
    data: TablesUpdate<'rooms'>,
    token?: string | null
  ): Promise<Tables<'rooms'> | null> {
    token ??= await getClerkToken()

    if (!token) return null

    try {
      const response = await fetch(`${this.BASE_URL}/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`)
      }

      const json: Tables<'rooms'> | null = await response.json()

      return json
    } catch (err) {
      logger.error(err)
    }

    return null
  },

  async delete(token?: string | null): Promise<Tables<'rooms'> | null> {
    token ??= await getClerkToken()

    if (!token) return null

    try {
      const response = await fetch(`${this.BASE_URL}/delete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`)
      }

      const json: Tables<'rooms'> | null = await response.json()

      return json
    } catch (err) {
      logger.error(err)
    }

    return null
  },

  async init(token?: string | null): Promise<void> {
    const roomDetail = await this.detail(null, token)

    let room: Omit<RoomDetail, 'user'> | null

    if (roomDetail) {
      room = {
        id: roomDetail.id,
        user_id: roomDetail.user_id,
        is_open: roomDetail.is_open,
        created_at: roomDetail.created_at,
        updated_at: roomDetail.updated_at,
      }
    } else {
      room = await this.create()
    }

    if (room) {
      if (room.is_open) {
        await this.update({ is_open: false })

        room.is_open = false
      }

      await storage.set('account:room', room)
    }
  },
}
