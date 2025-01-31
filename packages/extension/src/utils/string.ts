export const stringToSegments = (
  input: string,
  granularity?: 'grapheme' | 'word' | 'sentence'
) => {
  const segmenter = new Intl.Segmenter('ja-JP', { granularity })

  return [...segmenter.segment(input)]
}

export const splitString = (...args: Parameters<typeof stringToSegments>) => {
  return stringToSegments(...args).map((v) => v.segment)
}

export const countString = (input: string) => {
  return stringToSegments(input).length
}
