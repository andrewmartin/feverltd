import { Entry, EntryCollection } from 'contentful'
import { documentToHtmlString, Options } from '@contentful/rich-text-html-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'

enum CONTENT_TYPES {
  LINKED_IMAGE = 'linkedImage',
}

interface IContentfulItem {
  fields: any
}

const renderEmbeddedPageContent = (node: any) => {
  return documentToHtmlString(node?.data?.target?.fields?.page?.fields?.body)
}

const renderEmbeddedEntryContent = (node: any) => {
  const type = node?.data?.target?.sys?.contentType?.sys?.id
  const link = node?.data?.target?.fields?.link
  const src = node?.data.target.fields.image.fields.file.url

  switch (type) {
    case CONTENT_TYPES.LINKED_IMAGE:
      return `<a href='${link}'><img src='${src}' /></a>`
    default:
      return ''
  }
}

const options: Options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: renderEmbeddedPageContent,
    [BLOCKS.EMBEDDED_ASSET]: (node) =>
      `<custom-component>${JSON.stringify(node)}</custom-component>`,
    [INLINES.EMBEDDED_ENTRY]: renderEmbeddedEntryContent,
    [BLOCKS.PARAGRAPH]: (node, next) => `<p>${next(node.content).replace(/\n/g, `</br>`)}</p>`,
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
