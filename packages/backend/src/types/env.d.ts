export type Env = {
  CLERK_PUBLISHABLE_KEY: string
  CLERK_SECRET_KEY: string
  CLERK_ADMIN_USER_ID: string

  SUPABASE_URL: string
  SUPABASE_SECRET_KEY: string
}

export type HonoEnv = {
  Bindings: Env
  Variables: {}
}
