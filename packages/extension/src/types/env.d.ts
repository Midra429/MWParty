// import.meta.env
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

// process.env
declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv extends ImportMetaEnv {
        PARTYKIT_HOST: string
        PARTYKIT_HOST_SHORT: string
        CLERK_FRONTEND_API: string
        CLERK_PUBLISHABLE_KEY: string
      }
    }
  }
}
