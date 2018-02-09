// graphql-tools combines a schema string with resolvers.
import {
  makeExecutableSchema
} from 'graphql-tools'

import fetch from 'isomorphic-fetch'
import GraphQLJSON from 'graphql-type-json'
import {uaForFetch} from './utils'
import {userLoaderWithContext} from './userDataLoader'

// Construct a schema, using GraphQL schema language
const typeDefs = `
  scalar JSON

  type Query {
    posts(domain: String!): [Post]
    authors(domain: String!): [Author]
    serialJsonResponse(domain: String!,
        url: String = "/wp-json/wp/v2/",
				schema: String = "https://"
    ): SerialJsonResponse
  }

	type Post {
		id: ID
		title: String
		url: String
		author: Author
    content: String
    excerpt: String
	}

	 type Author {
    id: Int
    url: String
    name: String
    avatars: AvatarCollection
  }

	type AvatarCollection {
		big: String
    medium: String
    small: String
  }

	type SerialJsonResponse {
    response: JSON
    url: String!
    headers: [String]
  }
`

const resolvers = {
  JSON: GraphQLJSON,
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
  Query: {
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
  typeDefs,
  resolvers
})

// Optional: Export a function to get context from the request. It accepts two
// parameters - headers (lowercased http headers) and secrets (secrets defined
// in secrets section). It must return an object (or a promise resolving to it).
export function context (headers, secrets) {
  return {
    headers,
    secrets
  }
}
