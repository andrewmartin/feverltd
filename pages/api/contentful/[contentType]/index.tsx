import { IncomingMessage } from 'http'
import { contentfulClient } from 'src/api/contentful'
import { NextIncomingMessageArgs } from 'src/types'
import { buildItemsData } from 'src/util/contentful'
import { cors } from 'src/util/cors'

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

  await cors(req, res)

  if (req.method === 'GET') {
    try {
      const args = {
        content_type: contentType,
      } as any

      const entries = await contentfulClient.getEntries(args)
      entries.items = buildItemsData(entries.items)

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
