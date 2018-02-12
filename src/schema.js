// graphql-tools combines a schema string with resolvers.
import fetch from 'isomorphic-fetch'
import {uaForFetch} from './utils'
import {userLoaderWithContext} from './userDataLoader'

import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLSchema,
  GraphQLList
} from 'graphql'

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'Registered writer of articles',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Id of the user registered'
    },
    url: {
      type: GraphQLString,
      description: 'URL of the user to contact them',
      resolve: author => author.link
    },
    name: {
      type: GraphQLString,
      description: 'Name of the Author'
    }
  })
})

const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'Article in the website',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'Permanent identifier of the post'
    },
    title: {
      type: GraphQLString,
      description: 'Title of the article',
      resolve: post => post.title.rendered
    },
    url: {
      type: GraphQLString,
      description: 'URL of the article',
      resolve: post => post.link
    },
    content: {
      type: GraphQLString,
      description: 'Article contents',
      resolve: post => post.content.rendered
    },
    excerpt: {
      type: GraphQLString,
      description: 'Summary of the article',
      resolve: post => post.excerpt.rendered
    },
    author: {
      type: AuthorType,
      description: 'Author of the article',
      resolve: (post, args, ctx) => {
        const id = post.author
        const domain = post.link.split('/').slice(0, 3).join('/')
        return userLoaderWithContext(ctx)(domain).load(id)
      }
    }
  })
})
export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'Queries available',
    fields: () => ({
      posts: {
        type: new GraphQLList(PostType),
        description: 'List of articles in the website',
        args: {
          domain: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (_, args, ctx) => {
          const domain = args.domain
          return fetch(`https://${domain}/wp-json/wp/v2/posts/`/*, uaForFetch(ctx)*/)
            .then(res => res.json())
        }
      }
    })
  })
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
