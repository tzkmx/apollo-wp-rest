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
  query: `query ($domain1: String!,
  $domain2: String!,
	$url1: String!,
	$url2: String!) {
  semanario: posts(domain: $domain1) {
    ...thepost
  }
  wired: posts(domain: $domain2) {
    ...thepost
  }
  columna: serialJsonResponse(domain: $domain1, url: $url1) {
    ...theresponse
  }
  embed: serialJsonResponse(domain: $domain1, url: $url2) {
    ...theresponse
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