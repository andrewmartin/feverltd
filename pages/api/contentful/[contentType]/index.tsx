import { IncomingMessage } from 'http'
import { contentfulClient } from 'src/api/contentful'
import { NextIncomingMessageArgs } from 'src/types'
import { buildItemData } from 'src/util/contentful'

async function handler(
  req: IncomingMessage &
    NextIncomingMessageArgs<{
      contentType: string
    }>,
  res: any,
) {
  const {
    query: { contentType },
  } = req

  if (req.method === 'GET') {
    try {
      const args = {
        content_type: contentType,
      } as any

      const entries = await contentfulClient.getEntries(args)
      entries.items = buildItemData(entries.items)

      return res.json(entries)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      throw Error(`Error fetching Contentful API page.`)
    }
  }

  return null
}

export default handler
