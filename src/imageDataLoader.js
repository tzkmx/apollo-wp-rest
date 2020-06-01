const DataLoader = require('dataloader')
const fetch = require('isomorphic-fetch')

const loaderRegistry = {}

function imageDataLoader (domain) {
  if (loaderRegistry[domain]) {
    return loaderRegistry[domain]
  }

  const batchLoaderFn = keys => {
    const ids = keys.join(',')

    return fetch(`${domain}/wp-json/wp/v2/media/?include=${ids}`)
      .then(res => res.json())
  }
  const loader = new DataLoader(batchLoaderFn)
  loaderRegistry[domain] = loader
  return loader
}

module.exports.imageDataLoader = imageDataLoader
