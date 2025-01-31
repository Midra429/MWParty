export const isRoomId = (id: string) => {
  return /^[a-z0-9]{16}$/i.test(id)
}
