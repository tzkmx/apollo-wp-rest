import { graphql } from 'graphql'
import { schema, context } from './schema'

const query = `
  {
    postsQuery: posts(domain: "www.wired.com") {
      title
      author {
        name
      }
    }
    jsonResponse: serialJsonResponse(domain: "www.wired.com", url: "/wp-json/wp/v2/posts/?per_page=1") {
      url
      response
      headers
    }
    authors: authors(domain: "elsemanario.com") {
      name
      avatars {
        big
      }
    }
  }
`

graphql(schema, query, {}, context()).then(result => {
  console.log(result)
})

