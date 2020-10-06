import { Entry, EntryCollection } from 'contentful'
import { documentToHtmlString, Options } from '@contentful/rich-text-html-renderer'
import { BLOCKS } from '@contentful/rich-text-types'

interface IContentfulItem {
  fields: any
}

const renderEmbeddedPageContent = (node: any) => {
  return documentToHtmlString(node?.data?.target?.fields?.page?.fields?.body)
}

const options: Options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node) => renderEmbeddedPageContent(node),
    [BLOCKS.EMBEDDED_ASSET]: (node) =>
      `<custom-component>${JSON.stringify(node)}</custom-component>`,
  },
}

export const buildItemsData = (items: EntryCollection<any>['items']): any => {
  return items.map((item) => {
    const body = documentToHtmlString(item.fields?.body, options)
    return {
      id: item.sys.id,
      createdAt: item.sys.createdAt,
      ...item.fields,
      body,
    }
  })
}

/**
 *
 * @link https://github.com/contentful/rich-text/tree/master/packages/rich-text-html-renderer
 */
export const buildItemData = (item: Entry<any>): any => {
  const body = documentToHtmlString(item.fields?.body, options)
  return {
    id: item.sys.id,
    createdAt: item.sys.createdAt,
    ...item.fields,
    body,
  }
}
