
import Author from './Author'
import AvatarCollection from './AvatarCollection'
import Post from './Post'
import GraphQLJSON from 'graphql-type-json'
import SerialJsonResponse from './SerialJsonResponse'
import QueryRootType from './QueryRootType'

export const resolvers = {
  Author,
  Post,
  AvatarCollection,
  JSON: GraphQLJSON,
  SerialJsonResponse,
  QueryRootType
}
