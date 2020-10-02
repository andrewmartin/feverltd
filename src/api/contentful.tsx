import { ContentfulClientApi } from 'contentful'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const contentful = require('contentful')

export const contentfulClient = contentful.createClient({
  space: process.env.NEXT_SPACE_ID || '',
  accessToken: process.env.NEXT_CONTENTFUL_CONTENT_DELIVERY_API_TOKEN || '',
}) as ContentfulClientApi
