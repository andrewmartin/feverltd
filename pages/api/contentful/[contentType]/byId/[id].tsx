import { IncomingMessage } from 'http'
import { contentfulClient } from 'src/api/contentful'
import { NextIncomingMessageArgs } from 'src/types'
import { buildItemData } from 'src/util/contentful'
import { cors } from 'src/util/cors'

async function handler(
  req: IncomingMessage &
    NextIncomingMessageArgs<{
      contentType: string
      id: string
    }>,
  res: any,
) {
  const {
    query: { id },
  } = req

  await cors(req, res)

  if (req.method === 'GET') {
    try {
      const entry = await contentfulClient.getEntry(id)
      return res.json({
        item: buildItemData(entry),
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      throw Error(`Error fetching Contentful API page.`)
    }
  }

  return null
}

export default handler
