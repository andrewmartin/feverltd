import fetch from 'isomorphic-unfetch'

const API_ROOT = `${process.env.NEXT_SITE_ROOT}/api/contentful/`

export const getData = async <T>(path: string): Promise<T> => {
  const URL = `${API_ROOT}${path}`

  const data = await fetch(URL)
    .then((r) => {
      return r.text()
    })
    .then((t) => {
      return JSON.parse(t)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('error fetching', error)
    })
  return data
}
