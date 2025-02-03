export const skipSeekingEvent = () => {
  const _addEventListener = HTMLVideoElement.prototype.addEventListener

  let seekingListener: EventListener | null = null

  HTMLVideoElement.prototype.addEventListener = new Proxy(_addEventListener, {
    apply: (
      target,
      thisArg,
      argArray: Parameters<HTMLVideoElement['addEventListener']>
    ) => {
      const [event, listener] = argArray

      if (
        !seekingListener &&
        event === 'seeking' &&
        typeof listener === 'function' &&
        listener.name === 'bound value'
      ) {
        seekingListener = listener

        argArray[1] = function (this: HTMLVideoElement, evt: Event) {
          if (!document.querySelector('.mwp-video')) {
            seekingListener?.call(this, evt)
          }
        }
      }

      return Reflect.apply(target, thisArg, argArray)
    },
  })
}
