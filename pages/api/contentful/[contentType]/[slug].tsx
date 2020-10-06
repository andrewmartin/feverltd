import { IncomingMessage } from 'http'
import { contentfulClient } from 'src/api/contentful'
import { NextIncomingMessageArgs } from 'src/types'
import { buildItemsData } from 'src/util/contentful'
import { cors } from 'src/util/cors'

async function handler(
  req: IncomingMessage &
    NextIncomingMessageArgs<{
      contentType: string
      slug: string
    }>,
  res: any,
) {
  const {
    query: { contentType, slug },
  } = req

  await cors(req, res)

  if (req.method === 'GET') {
    try {
      const args = {
        content_type: contentType,
        'fields.slug': slug,
        include: 2, // @link https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/#retrieving-entries-with-search-parameters
      }

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
