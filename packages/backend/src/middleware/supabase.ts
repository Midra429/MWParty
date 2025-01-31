import type { MiddlewareHandler } from 'hono'
import type { SupabaseClientOptions } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

import { env } from 'hono/adapter'
import { SupabaseClient } from '@supabase/supabase-js'

declare module 'hono' {
  interface ContextVariableMap {
    supabase: SupabaseClient<Database>
  }
}

type SupabaseEnv = {
  SUPABASE_URL: string
  SUPABASE_SECRET_KEY: string
}

export const supabaseMiddleware = (
  options?: SupabaseClientOptions<'public'>
): MiddlewareHandler => {
  return async (ctx, next) => {
    const supabaseEnv = env<SupabaseEnv>(ctx)

    if (!supabaseEnv.SUPABASE_URL) {
      throw new Error('Missing Supabase URL')
    }

    if (!supabaseEnv.SUPABASE_SECRET_KEY) {
      throw new Error('Missing Supabase Secret key')
    }

    const supabaseClient = new SupabaseClient<Database>(
      supabaseEnv.SUPABASE_URL,
      supabaseEnv.SUPABASE_SECRET_KEY,
      options
    )

    ctx.set('supabase', supabaseClient)

    await next()
  }
}
