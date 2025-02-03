import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage/extension'

const STORAGE_VERSION = 1

export default async () => {
  let oldVersion = await storage.get('_version')
  let newVersion = oldVersion ?? STORAGE_VERSION

  // // v0.0.0 -> v0.0.0
  // if (version < 2) {
  //   logger.log('migration: v0.0.0 -> v0.0.0')

  //   version = 2
  // }

  if (newVersion !== oldVersion) {
    await storage.set('_version', newVersion)
  }
}
