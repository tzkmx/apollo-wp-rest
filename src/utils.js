const uaForFetch = ({secrets}) => {
  return typeof window.navigator !== 'undefined' ? null : { headers: { 'User-Agent': `${secrets.userAgent}` } }
}

export {uaForFetch}