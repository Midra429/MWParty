declare global {
  interface UserPublicMetadata {
    isAdmin?: boolean
  }

  interface UserPrivateMetadata {}

  interface UserUnsafeMetadata {}
}

export type ClerkUserPublic = {
  id: string
  username: string
  name: string | null
  imageUrl: string

  _isOwn?: boolean
}
