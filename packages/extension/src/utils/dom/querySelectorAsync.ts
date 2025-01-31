export const querySelectorAsync = async <E extends Element = Element>(
  parent: ParentNode,
  selectors: string,
  options: {
    /**
     * クエリを実行する間隔 (ミリ秒)
     * @default 500
     */
    intervalMs?: number

    /**
     * クエリを実行する最大時間 (ミリ秒)
     * @default 5000
     */
    timeoutMs?: number
  } = {}
): Promise<E | null> => {
  const { intervalMs = 500, timeoutMs = 5000 } = options

  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const element = parent.querySelector<E>(selectors)

      if (element) {
        clearInterval(intervalId)
        resolve(element)
      }
    }, intervalMs)

    setTimeout(() => {
      clearInterval(intervalId)
      resolve(null)
    }, timeoutMs)
  })
}
