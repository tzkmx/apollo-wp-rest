import {uaForFetch} from './utils'
import DataLoader from 'dataloader'
// import fetch from 'isomorphic-fetch'

const loaderRegistry = {}

const userLoaderWithContext = context => domain => {
  if (loaderRegistry[domain]) {
    return loaderRegistry[domain]
  }
  const batchLoaderFn = keys => {
    const ids = keys.join(',')
    return fetch(`${domain}/wp-json/wp/v2/users/?include=${ids}`, uaForFetch(context))
      .then(res => res.json())
  }
  const loader = new DataLoader(batchLoaderFn)
  loaderRegistry[domain] = loader
  return loader
}

export {userLoaderWithContext}



