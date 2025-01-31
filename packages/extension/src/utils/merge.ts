import _deepmerge from 'deepmerge'

export const merge = <T extends Object>(a: T, b: Partial<T>): T => {
  const obj = {}

  Object.keys({ ...a, ...b }).forEach((key) => {
    // @ts-ignore
    obj[key] = b[key] ?? a[key]
  })

  return obj as T
}

export const deepmerge = <T1, T2>(a: T1, b: T2): T1 & T2 => {
  return _deepmerge(a as any, b as any, {
    customMerge: (_, options) => {
      return (a, b) => {
        if (typeof b === 'undefined') {
          return a
        }

        return _deepmerge(a, b, options)
      }
    },
  })
}
