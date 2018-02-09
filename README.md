# GraphQL wrapper for WordPress REST API

### Quick start guide

```bash
npm install
export userAgent=<your value here>
npm start
```

### App secrets

This pad contains a secret userAgent used to identify the use of this API in your webserver logs

You can set them by exporting them as environment variables in your shell: 

```sh
export userAgent=<your value here>
```

### Changelog

- 0.1.13 Including DataLoader to batch calls to Users Endpoint
  - deployed to [now.sh](https://graphql-wordpress-rest-api-aloofwnqkq.now.sh/graphql)
- 0.1.0 Initial version draft [from Launchpad](https://launchpad.graphql.com/41rwr94l9)

This project was created with [Apollo Launchpad](https://launchpad.graphql.com)