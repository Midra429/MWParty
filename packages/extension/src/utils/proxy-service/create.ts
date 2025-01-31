import type { ExtensionMessenger } from '@webext-core/messaging'
import type { WindowMessenger } from '@webext-core/messaging/page'
import type { ProxyService } from '@webext-core/proxy-service'
import type { Service, ProtocolMap } from '.'

export const createProxy = <TService extends Service>(
  name: string,
  sendMessage: (
    | ExtensionMessenger<ProtocolMap>
    | WindowMessenger<ProtocolMap>
  )['sendMessage']
) => {
  const messageKey = `proxy-service:${name}`

  const create = (paths: string[] = []): ProxyService<TService> => {
    const wrapped = (() => {}) as ProxyService<TService>

    const proxy = new Proxy(wrapped, {
      get(target, p, receiver) {
        if (p === '__proxy' || typeof p === 'symbol') {
          return Reflect.get(target, p, receiver)
        }

        return create([...paths, p])
      },

      async apply(_target, _thisArg, args) {
        const sendMsgArgs = [
          messageKey,
          { paths, args },
          ...([] as any),
        ] as const

        try {
          return await sendMessage(...sendMsgArgs)
        } catch {
          return sendMessage(...sendMsgArgs)
        }
      },
    })

    // @ts-expect-error
    proxy.__proxy = true

    return proxy
  }

  return create()
}
