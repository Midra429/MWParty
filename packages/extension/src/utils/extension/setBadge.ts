import { webext } from '@/utils/webext'
import { readableColor } from '@/utils/color'

const BADGE_COLORS = {
  primary: '#0478ff',
  red: '#f31260',
  green: '#17c964',
  blue: '#006fee',
  yellow: '#f5a524',
}

export const setBadge = ({
  text,
  color,
  tabId,
}: {
  text?: string | null
  color?: keyof typeof BADGE_COLORS
  tabId?: number
}) => {
  if (typeof text !== 'undefined') {
    webext.action.setBadgeText({
      text,
      tabId,
    })
  }

  if (typeof color !== 'undefined') {
    const bgColor = BADGE_COLORS[color]
    const fgColor = readableColor(bgColor)

    webext.action.setBadgeBackgroundColor({
      color: bgColor,
      tabId,
    })

    webext.action.setBadgeTextColor({
      color: fgColor,
      tabId,
    })
  }
}
