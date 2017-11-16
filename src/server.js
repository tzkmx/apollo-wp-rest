import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';

import { schema, rootValue, context } from './schema';

const PORT = 3000;
const server = express();

if (typeof process.env.user_agent === 'undefined') {
  console.warn('WARNING: process.env.user_agent is not defined. Check README.md for more information');
}

server.use('/graphql', bodyParser.json(), graphqlExpress(request => ({
  schema,
  rootValue,
  context: context(request.headers, process.env),
})));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  query: `{
  columna: serialJsonResponse(domain: "elsemanario.com", url: "/wp-json/boletim/v1/columns/?skip=0&num=1") {
    ...theresponse
  }
  embed: serialJsonResponse(domain: "elsemanario.com", url: "/wp-json/oembed/1.0/embed/?url=https://elsemanario.com/?p=232033") {
    ...theresponse
  }
  semanario: posts(domain: "elsemanario.com") {
    ...thepost
  }
  wired: posts(domain: "www.wired.com") {
    ...thepost
  }
}

fragment thepost on Post {
  title
  url
  author {
    name
  }
}

fragment theresponse on SerialJsonResponse {
  url
  response
  headers
}
`,
}));

server.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}/graphql`);
  console.log(`View GraphiQL at http://localhost:${PORT}/graphiql`);
});