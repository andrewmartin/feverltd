import { EntryCollection } from 'contentful'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

interface IContentfulItem {
  fields: any
}

export const buildItemData = (items: EntryCollection<any>['items']): any => {
  return items.map((item) => {
    const body = documentToHtmlString(item.fields?.body)
    return {
      ...item.fields,
      body,
    }
  })
}
