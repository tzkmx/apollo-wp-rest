// Welcome to Launchpad!
// Log in to edit and save pads, run queries in GraphiQL on the right.
// Click "Download" above to get a zip with a standalone Node.js server.
// See docs and examples at https://github.com/apollographql/awesome-launchpad

// graphql-tools combines a schema string with resolvers.
import {
  makeExecutableSchema,
} from 'graphql-tools';

import fetch from 'node-fetch';
import GraphQLJSON from 'graphql-type-json';
//import {jpath} from 'json-path';

// Construct a schema, using GraphQL schema language
const typeDefs = `
  scalar JSON

  type Query {
    myFavoriteArtists: [Artist]
    posts(domain: String!): [Post]
    authors(domain: String!): [Author]
    serialJsonResponse(domain: String!,
        url: String = "/wp-json/wp/v2/",
				schema: String = "https://"
    ): SerialJsonResponse
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
    content: String
    excerpt: String
	}

	 type Author {
    id: Int
    url: String
    name: String
    avatars: AvatarCollection
  }

	type AvatarCollection {
		big: String
    medium: String
    small: String
  }

	type SerialJsonResponse {
    response: JSON
    url: String!
    headers: [String]
  }
`;

const uaForFetch = (context) => { 
  return { headers: { "User-Agent": `${context.secrets.user_agent}` } }
}

const resolvers = {
  JSON: GraphQLJSON,
  Post: {
    title: post => post.title.rendered,
    url: post => post.link,
    author: (post,args,ctx) => {
      const id = post.author;
      const domain = post.link.split('/').slice(0,3).join('/');
      return fetch(`${domain}/wp-json/wp/v2/users/${id}`, uaForFetch(ctx))
      	.then(res => res.json());
    },
    content: post => post.content.rendered,
    excerpt: post => post.excerpt.rendered,
  },
  Author: {
    name: author => author.name,
    url: author => author.link,
    avatars: author => author.avatar_urls
  },
  AvatarCollection: {
    big: col => col[96],
    medium: col => col[48],
    small: col => col[24]
  },
  SerialJsonResponse: {
    url: response => response.clone().url,
    response: response => response.clone().json(),
    headers: response => {
      const headers = response.clone().headers._headers;
      let accum = [];
      for(var key in headers) {
        accum.push(key.toString() + ': ' + headers[key]);
      }
      return accum;
    }
  },
  Query: {
    posts: (root, args, ctx) => {
      const domain = args.domain;
      return fetch(`https://${domain}/wp-json/wp/v2/posts/`, uaForFetch(ctx))
      	.then(res => res.json());
    },
    authors: (root, args, ctx) => {
      const domain = args.domain;
      return fetch(`https://${domain}/wp-json/wp/v2/users/`, uaForFetch(ctx))
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
    },
    serialJsonResponse: (root, args, ctx) => {
      return fetch(`${args.schema}${args.domain}${args.url}`, uaForFetch(ctx));
    }
  },
  Artist: {
  	twitterUrl: artist => artist.externalLinks.twitter[0].url,
    image: artist => artist.images[0].url,
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
    image: event => event.images[0].url,
    startDateTime: event => event.dates.start.dateTime
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