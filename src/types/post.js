import Author from './author'

const Post = `
type Post {
  id: ID
  title: String
  url: String
  author: Author
  content: String
  excerpt: String
}
`

export default () => [Post, Author]
