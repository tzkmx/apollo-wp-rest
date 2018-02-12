import { graphql } from 'graphql'
import { schema } from './schema'

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

graphql(schema, query).then(result => {
  console.log(result)
})

