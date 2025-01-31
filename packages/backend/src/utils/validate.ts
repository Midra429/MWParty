export const isUserId = (id: string) => {
  return /^[a-z0-9_\-]{1,64}$/i.test(id)
}

export const isRoomId = (id: string) => {
  return /^[a-z0-9]{16}$/i.test(id)
}
