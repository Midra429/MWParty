import { createClerkClient } from '@clerk/chrome-extension/background'

export const getClerkClient = () => {
  return createClerkClient({
    publishableKey: import.meta.env.WXT_CLERK_PUBLISHABLE_KEY,
  })
}

export const getClerkToken = async () => {
  const clerk = await getClerkClient()

  if (!clerk.session) {
    return null
  }

  return clerk.session.getToken()
}
