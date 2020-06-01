import { uaForFetch } from './utils'
const DataLoader = require('dataloader')
const fetch = require('isomorphic-fetch')

const loaderRegistry = {}

const userLoaderWithContext = context => domain => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (loaderRegistry[domain]) {
    return loaderRegistry[domain]
  }
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const batchLoaderFn = keys => {
    const ids = keys.join(',')
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return fetch(`${domain}/wp-json/wp/v2/users/?include=${ids}`, uaForFetch(context))
      .then(res => res.json())
  }
  const loader = new DataLoader(batchLoaderFn)
  loaderRegistry[domain] = loader
  return loader
}

export { userLoaderWithContext }
