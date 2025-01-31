import { HTTPException } from 'hono/http-exception'

export const HTTP_EXCEPTIONS = {
  UNAUTHORIZED: new HTTPException(401, {
    message: 'ユーザー認証に失敗しました',
  }),

  INVALID_PARAMS: new HTTPException(400, {
    message: 'リクエストボディの形式が不正確です',
  }),
}
