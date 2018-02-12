import { graphql } from 'graphql'
import { schema, context } from './schema'

const query = `
  {
    posts(domain: "www.wired.com") {
      title
      author {
        name
      }
    }
  }
`

graphql(schema, query, {}, context()).then(result => {
  console.log(result)
})

