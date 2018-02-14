// import fetch from 'isomorphic-fetch'
import {uaForFetch} from '../utils'

const QueryRootType = {
  posts: (root, args, ctx) => {
    const domain = args.domain
    return fetch(`https://${domain}/wp-json/wp/v2/posts/`, uaForFetch(ctx))
      .then(res => res.json())
  },
  authors: (root, args, ctx) => {
    const domain = args.domain
    return fetch(`https://${domain}/wp-json/wp/v2/users/`, uaForFetch(ctx))
      .then(res => res.json())
  },
    serialJsonResponse: (root, args, ctx) => {
    return fetch(`${args.schema}${args.domain}${args.url}`, uaForFetch(ctx))
  }
}

export default QueryRootType
