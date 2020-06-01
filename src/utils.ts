// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const uaForFetch = ({ secrets }) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return { headers: { 'User-Agent': `${secrets.userAgent}` } }
}

export { uaForFetch }
