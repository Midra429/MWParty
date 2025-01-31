import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage/extension'

const STORAGE_VERSION = 1

export default async () => {
  let version = (await storage.get('_version')) ?? STORAGE_VERSION

  // // v0.0.0 -> v0.0.0
  // if (version < 2) {
  //   logger.log('migration: v0.0.0 -> v0.0.0')

  //   version = 2
  // }

  await storage.set('_version', version)
}
