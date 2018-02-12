import {userLoaderWithContext} from '../userDataLoader'

const Post = {
  title: post => post.title.rendered,
    url: post => post.link,
  author: (post, args, ctx) => {
    const id = post.author
    const domain = post.link.split('/').slice(0, 3).join('/')
    return userLoaderWithContext(ctx)(domain).load(id)
  },
  content: post => post.content.rendered,
  excerpt: post => post.excerpt.rendered
}

export default Post
