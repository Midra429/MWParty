export const skipSeekingEvent = () => {
  const _addEventListener = HTMLVideoElement.prototype.addEventListener

  let seekingListener: EventListener | null = null

  HTMLVideoElement.prototype.addEventListener = new Proxy(_addEventListener, {
    apply(target, thisArg, argArray: Parameters<typeof _addEventListener>) {
      const [event, listener] = argArray

      if (
        !seekingListener &&
        event === 'seeking' &&
        typeof listener === 'function' &&
        listener.name === 'bound value'
      ) {
        seekingListener = listener

        function hookSeekingEvent(this: HTMLVideoElement, evt: Event) {
          if (!document.querySelector('.mwp-video')) {
            seekingListener?.call(this, evt)
          }
        }

        return Reflect.apply(target, thisArg, [event, hookSeekingEvent])
      }

      return Reflect.apply(target, thisArg, argArray)
    },
  })
}
