export const queue = {
  add<T extends Array<any>>(array: T, value: T[number], max: number) {
    array.push(value)

    this.filter(array, max)
  },

  filter<T extends Array<any>>(array: T, max: number) {
    const over = array.length - max

    if (0 < over) {
      array.splice(0, over)
    }
  },
}
