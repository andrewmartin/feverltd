import { ContentfulCollection, Entry } from 'contentful'

export interface NextIncomingMessageArgs<Q> {
  body: any
  query: Q
}

export interface IMenuItemPage {
  name: string
  page: {
    fields: {
      title: string
      slug: string
    }
  }
}

export interface IMenuItemLink {
  name: string
  url: string
}

export type IMenuItem = IMenuItemPage | IMenuItemLink

export interface IMenuItemResult {
  slug: string
  body: string
  menuItems: Entry<IMenuItem>[]
}

interface ContentfulSysFields {
  createdAt: string
  id: string
}

export interface INewsItem extends ContentfulSysFields {
  title: string
  body: string
}

export interface IPageItem extends ContentfulSysFields {
  title: string
  body: string
}

/**
 *  {
  sys: { type: 'Array' },
  total: 1,
  skip: 0,
  limit: 100,
  items: [ { slug: 'main', menuItems: [Array], body: '' } ],
  includes: {
    Entry: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object]
    ]
  }
}
 */

export type ContentfulResult<T> = ContentfulCollection<T>
