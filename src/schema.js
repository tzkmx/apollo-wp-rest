// graphql-tools combines a schema string with resolvers.
import {
  makeExecutableSchema
} from 'graphql-tools'

import fetch from 'isomorphic-fetch'
import GraphQLJSON from 'graphql-type-json'
import {uaForFetch} from './utils'
import {userLoaderWithContext} from './userDataLoader'
import Post from './types/post'
import Author from './types/author'
import SerialJsonResponse from './types/serialJsonResponse'

// Construct a schema, using GraphQL schema language
const SchemaDefinition = `
  schema {
    query: QueryRootType
  }
`

const QueryRootType = `
  type QueryRootType {
    posts(domain: String!): [Post]
    authors(domain: String!): [Author]
    serialJsonResponse(domain: String!,
      url: String = "/wp-json/wp/v2/",
      schema: String = "https://"
    ): SerialJsonResponse
  }
`


const resolvers = {
  Post: {
    title: post => post.title.rendered,
    url: post => post.link,
    author: (post, args, ctx) => {
      const id = post.author
      const domain = post.link.split('/').slice(0, 3).join('/')
      return userLoaderWithContext(ctx)(domain).load(id)
    },
    content: post => post.content.rendered,
    excerpt: post => post.excerpt.rendered
  },
  Author: {
    name: author => author.name,
    url: author => author.link,
    avatars: author => author.avatar_urls
  },
  AvatarCollection: {
    big: col => col[96],
    medium: col => col[48],
    small: col => col[24]
  },
  JSON: GraphQLJSON,
  SerialJsonResponse: {
    url: response => response.clone().url,
    response: response => response.clone().json(),
    headers: response => {
      const headers = response.clone().headers._headers
      let accum = []
      for (var key in headers) {
        accum.push(key.toString() + ': ' + headers[key])
      }
      return accum
    }
  },
  QueryRootType: {
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
}


// Required: Export the GraphQL.js schema object as "schema"
export const schema = makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
    QueryRootType,
    Post,
    Author,
    SerialJsonResponse
  ],
  resolvers
})

// Optional: Export a function to get context from the request. It accepts two
// parameters - headers (lowercased http headers) and secrets (secrets defined
// in secrets section). It must return an object (or a promise resolving to it).
export function context (headers, secrets) {
  return {
    headers,
    secrets: typeof secrets !== 'undefined' ? secrets : {userAgent: navigator.userAgent}
  }
}
