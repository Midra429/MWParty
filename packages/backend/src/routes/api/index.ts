import type { HonoEnv } from '@/types/env'

import { Hono } from 'hono'

import apiRoom from './room'

const routeApi = new Hono<HonoEnv>()

routeApi.route('/room', apiRoom)

export default routeApi
