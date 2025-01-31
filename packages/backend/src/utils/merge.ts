export const merge = <T extends Object>(a: T, b: Partial<T>): T => {
  const obj = {}

  Object.keys({ ...a, ...b }).forEach((key) => {
    // @ts-ignore
    obj[key] = b[key] ?? a[key]
  })

  return obj as T
}
