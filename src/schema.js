// graphql-tools combines a schema string with resolvers.
import {
  makeExecutableSchema
} from 'graphql-tools'

import Post from './types/post'
import Author from './types/author'
import SerialJsonResponse from './types/serialJsonResponse'
import {resolvers} from './resolvers/'

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
