import { NowRequest, NowResponse } from '@now/node'
import { schema } from '../schema'
const { graphql } = require('graphql')

export default function (req: NowRequest, res: NowResponse): void {
  const { query } = req.query as any as { query: string }
  // @ts-ignore
  graphql(
    schema,
    query,
    {},
    { secrets: { userAgent: 'tzkmx' } }
  ).then(function (result) {
    res.status(200).send(result)
  })
}
