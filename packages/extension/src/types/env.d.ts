interface ImportMetaEnv {
  // .env
  readonly WXT_PARTYKIT_HOST: string
  readonly WXT_PARTYKIT_HOST_SHORT: string
  readonly WXT_CLERK_FRONTEND_API: string
  readonly WXT_CLERK_PUBLISHABLE_KEY: string

  // .env.chrome
  readonly WXT_CRX_PUBLIC_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
