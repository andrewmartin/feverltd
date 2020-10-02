import { IMenuItem, IMenuItemResult } from 'src/types'

export const buildMenuItems = (items: Array<IMenuItemResult>) => {
  return items
    .find((i) => i.slug === 'main')
    ?.menuItems.map((i) => {
      return { ...i.fields }
    }) as IMenuItem[]
}
