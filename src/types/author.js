import AvatarCollection from './avatarCollection'

const Author = `
type Author {
  id: Int
  url: String
  name: String
  avatars: AvatarCollection
}
`

export default () => [Author, AvatarCollection]
