export type JsxRendererProps = {
  title?: string
  description?: string
}

declare module 'hono' {
  interface ContextRenderer {
    (content: string | Promise<string>, props?: JsxRendererProps): Response
  }
}

export {}
