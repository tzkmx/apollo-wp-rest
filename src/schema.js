// Welcome to Launchpad!
// Log in to edit and save pads, run queries in GraphiQL on the right.
// Click "Download" above to get a zip with a standalone Node.js server.
// See docs and examples at https://github.com/apollographql/awesome-launchpad

// graphql-tools combines a schema string with resolvers.
import {
  makeExecutableSchema,
} from 'graphql-tools';

import fetch from 'node-fetch';

// Construct a schema, using GraphQL schema language
const typeDefs = `
  type Query {
    myFavoriteArtists: [Artist]
      wiredPosts: [Post]
      wiredAuthors: [Author]
  }

  type Artist {
    id: ID
    name: String
    image: String
    twitterUrl: String
    events: [Event]
  }

  type Event {
    name: String
    image: String
    startDateTime: String
  }

  type Post {
    id: ID
    title: String
    url: String
    author: Author
  }

  type Author {
    id: Int
    name: String
    link: String
    avatars: AvatarCollection
  }

  type AvatarCollection {
    big: String
    medium: String
    small: String
  }
`;

const resolvers = {
  Post: {
    title: (post) => {
      return post.title.rendered;
    },
    url: (post) => {
      return post.link;
    },
    author: (post) => {
      const id = post.author;
      return fetch(`https://www.wired.com/wp-json/wp/v2/users/${id}`)
        .then(res => res.json());
    }
  },
  Author: {
    name: (author) => {
      return author.name;
    },
    link: (author) => author.link,
    avatars: (author) => author.avatar_urls
  },
  AvatarCollection: {
    big: (col) => col[96],
    medium: (col) => col[48],
    small: (col) => col[24]
  },
  Query: {
    wiredPosts: (root, args, context) => {
      return fetch(`https://www.wired.com/wp-json/wp/v2/posts/`)
        .then(res => res.json());
    },
    wiredAuthors: (root, args, context) => {
      return fetch(`https://www.wired.com/wp-json/wp/v2/users/`)
        .then(res => res.json());
    },
    myFavoriteArtists: (root, args, context) => {
      return Promise.all(myFavoriteArtists.map(({name, id}) => {
        return fetch(`https://app.ticketmaster.com/discovery/v2/attractions/${id}.json?apikey=${context.secrets.TM_API_KEY}`)
          .then(res => res.json())
          .then(data => {
            return { name, id, ...data };
          });
      }));
    }
  },
  Artist: {
    twitterUrl: (artist) => {
      return artist.externalLinks.twitter[0].url;
    },
    image: (artist) => artist.images[0].url,
    events: (artist, args, context) => {
      return fetch(`https://app.ticketmaster.com/discovery/v2/events.json?size=10&apikey=${context.secrets.TM_API_KEY}&attractionId=${artist.id}`)
        .then(res => res.json())
        .then(data => {
          // Sometimes, there are no upcoming events
            return (data && data._embedded && data._embedded.events) || []
      });
    },
    
	},
  Event: {
    image: (event) => event.images[0].url,
    startDateTime: (event) => event.dates.start.dateTime
  }
}

// Required: Export the GraphQL.js schema object as "schema"
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const myFavoriteArtists = [
  {
    name: 'Kansas',
    id: 'K8vZ9171C-f',
  },
  {
    name: 'Lil Yachty',
    id: 'K8vZ9174v57',
  },
  {
    name: 'Jason Mraz',
    id: 'K8vZ9171CVV',
  },
];

// Optional: Export a function to get context from the request. It accepts two
// parameters - headers (lowercased http headers) and secrets (secrets defined
// in secrets section). It must return an object (or a promise resolving to it).
export function context(headers, secrets) {
  return {
    headers,
    secrets,
  };
};